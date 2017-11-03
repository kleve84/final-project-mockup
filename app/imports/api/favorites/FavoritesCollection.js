import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Favorites */

/**
 * Represents a specific favorite, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class FavoritesCollection extends BaseCollection {

  /**
   * Creates the Favorites collection.
   */
  constructor() {
    super('Favorites', new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Interest.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the favorite definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, description }) {
    check(name, String);
    check(description, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Interest`);
    }
    return this._collection.insert({ name, description });
  }

  /**
   * Returns the Interest name corresponding to the passed favorite docID.
   * @param favoriteID An favorite docID.
   * @returns { String } An favorite name.
   * @throws { Meteor.Error} If the favorite docID cannot be found.
   */
  findName(favoriteID) {
    this.assertDefined(favoriteID);
    return this.findDoc(favoriteID).name;
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param favoriteIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(favoriteIDs) {
    return favoriteIDs.map(favoriteID => this.findName(favoriteID));
  }

  /**
   * Throws an error if the passed name is not a defined Interest name.
   * @param name The name of an favorite.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Interest names.
   * @param names An array of (hopefully) Interest names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Interest name, or throws an error if it cannot be found.
   * @param { String } name An favorite name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an Interest.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Interest names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of favorite names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Interest name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Interest docID in a format acceptable to define().
   * @param docID The docID of an Interest.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const description = doc.description;
    return { name, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Favorites = new FavoritesCollection();
