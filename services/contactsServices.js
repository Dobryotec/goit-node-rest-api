import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json');

const updateContacts = contacts =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(({ id }) => id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) return null;
  const [deleteContact] = contacts.splice(idx, 1);
  await updateContacts(contacts);
  return deleteContact;
}

async function addContact({ name, email, phone }) {
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const contacts = await listContacts();
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

async function modifyContact(contactId, data) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) return null;
  contacts[idx] = { ...contacts[idx], ...data };
  await updateContacts(contacts);
  return contacts[idx];
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
};
