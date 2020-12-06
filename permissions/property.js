/**
 * A module to implement role based permissions for property (house).
 * @module permissions/property
 * @requires role-acl
 * @author Faizaan Chowdhary
 */
const AccessControl = require('role-acl');
const ac = new AccessControl();

// only user who created property can update it.
ac
  .grant('user')
  .condition( { Fn:'EQUALS', args: { 'requester' : '$.owner' }})
  .execute('update')
  .on('property');

// only admin can delete property from the system.
ac
  .grant('admin')
  .execute('delete')
  .on('property');


exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({ requester : requester.UserId , owner : data.UserId})
    .execute('update')
    .sync()
    .on('property');
}

exports.delete = (requester , data) => {  
  return ac
    .can(requester.role)
    .execute('delete')
    .sync()
    .on('property');
}
