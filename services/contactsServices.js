import { Contact } from '../db/Contact.js';

function listContacts({ where, skip = 0, limit = 20 }) {
  return Contact.findAndCountAll({
    where,
    offset: Number(skip),
    limit: Number(limit),
  });
}


function getContact(query) {
  return Contact.findOne({
    where: query,
  });
}

async function removeContact(query) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

function addContact(data) {
  return Contact.create(data);
}

async function modifyContact(query, data) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.update(data);
  return contact;
}

async function updateStatusContact(query, data) {
  const contact = await getContact(query);
  if (!contact) return null;

  await contact.update({ ...contact, ...data });
  return contact;
}

export {
  listContacts,
  getContact,
  removeContact,
  addContact,
  modifyContact,
  updateStatusContact,
};
