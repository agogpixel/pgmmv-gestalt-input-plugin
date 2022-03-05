# Gestalt Input Plugin

An alternative way to define input link conditions with the following:

-   JSON specification that maps an input key (`OperationKey` or `ReservedKeyCodePc`) to either a pressed (`true`) or released (`false`) state.
    -   Any errors in the input specification are output to the player's "Runtime Console Log"; an input condition will always return `false` in this case.
-   Resolves any object instance to an operable controller.
    -   Configurable fallback behavior when a controller is not found.

These features can open up new approaches to how you can structure your PGMMV games.

> **⚠️Important⚠️**
>
> Make sure you setup up your controllable players as `Starting Points` in your scenes. Check out [baz](https://bazratcreates.itch.io/)'s [Multiplayer & Controller ID Setup tutorial](https://www.youtube.com/watch?v=FVp2UVoNpqc) for more details!

## Link Condition Parameters

-   **Gestalt Input Condition**
    -   `Input Condition Identifier`: Non-empty string unique to the object.
    -   `Input Condition JSON`: Domain specific JSON mapping input key to pressed/released state.
    -   `Controller Fallback`: Define how this input condition behaves when no operable controller is found.
        -   `ANY CONTROLLER`: Polls all controller IDs for first input condition satisfaction found. This is the default behavior for non-starting point objects.
        -   `ALWAYS FALSE`: The link condition will never resolve to true.

## Input Condition JSON EBNF

[Extended Backus-Naur form](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) representation:

```
clause       = and clause | or clause | predicate ;
clauses      = clause [ , ',' , clauses ] ;
clause array = '[' , clauses , ']' ;
and clause   = '{' , '"AND"' , ':' , clause array '}' ;
or clause    = '{' , '"OR"' , ':' , clause array '}' ;
predicate    = '[' , key , ',' , boolean , ']' ;
boolean      = 'true' | 'false'
key          =
    | '"Op_A"'
    | '"Op_B"'
    | '"Op_X"'
    | '"Op_Y"'
    | '"Op_R1"'
    | '"Op_R2"'
    | '"Op_L1"'
    | '"Op_L2"'
    | '"Op_Up"'
    | '"Op_Down"'
    | '"Op_Left"'
    | '"Op_Right"'
    | '"Op_LeftStickUp"'
    | '"Op_LeftStickDown"'
    | '"Op_LeftStickLeft"'
    | '"Op_LeftStickRight"'
    | '"Op_RightStickUp"'
    | '"Op_RightStickDown"'
    | '"Op_RightStickLeft"'
    | '"Op_RightStickRight"'
    | '"Op_LeftClick"'
    | '"Op_RightClick"'
    | '"Op_Start"'
    | '"Op_Select"'
    | '"Op_Home"'
    | '"Op_Ok"'
    | '"Op_Cancel"'
    | '"Pc_W"'
    | '"Pc_A"'
    | '"Pc_S"'
    | '"Pc_D"'
    | '"Pc_LeftClick"'
    | '"Pc_RightClick"'
    | '"Pc_Up"'
    | '"Pc_Right"'
    | '"Pc_Down"'
    | '"Pc_Left"'
    | '"Pc_MiddleClick"'
    | '"Pc_WheelUp"'
    | '"Pc_WhellDown"'
    | '"Pc_MousePointer"'
    ;
```

## Example Input Condition JSON

`true` only when `Up Right` on the `Left Stick` is being pressed:

```
{
  "AND": [
    ["Op_LeftStickDown", false],
    ["Op_LeftStickUp", true],
    ["Op_LeftStickRight", true],
    ["Op_LeftStickLeft", false]
  ]
}
```

`true` only when any direction other than `Up Right` is being pressed on the `Left Stick`:

```
{
  "OR": [
    {
      "AND": [
        ["Op_LeftStickUp", false],
        {
          "OR": [
            ["Op_LeftStickRight", true],
            ["Op_LeftStickDown", true],
            ["Op_LeftStickLeft", true]
          ]
        }
      ]
    },
    {
      "AND": [
        ["Op_LeftStickRight", false],
        {
          "OR": [
            ["Op_LeftStickDown", true],
            ["Op_LeftStickUp", true],
            ["Op_LeftStickLeft", true]
          ]
        }
      ]
    }
  ]
}
```

## Notes

-   **Input Condition JSON**: Parsed **once** (into a function) and then cached. Cache keys are constructed from the current `objectId`, `instanceId`, and user specified `Input Condition Identifier`; thus the `Input Condition Identifier` must be unique to the object/instance - no runtime checks are performed for correctness here (other than ensuring the identifier is a non-empty string).

    -   While the editor takes care of validating the _structure_ any input JSON, additional checks are performed to ensure the JSON conforms to our _grammar_. Any errors are logged and the affected input condition will always return false.

-   **Controller IDs**: Fetched on each link condition test as follows:

    1. Current object is checked if `operable` and its instance's built-in `Controller ID` variable value is a valid controller ID.
    2. When controller ID value is invalid, traverse to the instance's parent object instance (if it exists) and repeat step 1.
    3. If search is exhausted (ie. no valid controller ID and no more ancestors to check), use specified fallback setting for this link condition.

    We perform this search each time in case a child object gets swapped out to a different 'operable object hierarchy' during the course of gameplay. Beware of this when building objects that make of use of `Common Actions` with this link condition.

> _gestalt_ - _an organized whole that is perceived as more than the sum of its parts._
