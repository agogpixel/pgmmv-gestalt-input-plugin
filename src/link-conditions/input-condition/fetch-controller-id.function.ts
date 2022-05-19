/**
 * Exports fetch controller ID function.
 *
 * @module link-conditions/input-condition/fetch-controller-id.function
 */
import { getObjectInstance } from '@agogpixel/pgmmv-object-support/src/object-instance/get-object-instance.function';
import { getParentObjectInstance } from '@agogpixel/pgmmv-object-support/src/object-instance/get-parent-object-instance.function';
import { getControllerId } from '@agogpixel/pgmmv-object-support/src/object-instance/variables/get-controller-id.function';

/**
 * Fetch controller ID.
 *
 * @param objectId Object ID.
 * @param instanceId Instance ID.
 * @returns Resolved controller ID or `-1`.
 */
export function fetchControllerId(objectId: number, instanceId: number): number {
  const obj = Agtk.objects.get(objectId);
  const instance = getObjectInstance(instanceId);

  const controllerId = getControllerId(instance);

  if (obj.operatable && controllerId >= 0) {
    return controllerId;
  }

  const parentInstance = getParentObjectInstance(instance);

  if (!parentInstance) {
    return -1;
  }

  return fetchControllerId(parentInstance.objectId, parentInstance.id);
}
