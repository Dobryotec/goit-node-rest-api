import { Contact } from '../db/Contact.js';

function listContacts() {
  return Contact.findAll();
}

function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

function addContact(data) {
  return Contact.create(data);
}

async function modifyContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.update(data);
  return contact;
}

async function updateStatusContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;

  await contact.update({ ...contact, ...data });
  return contact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
  updateStatusContact,
};
