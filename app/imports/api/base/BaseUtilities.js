import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Favorites } from '/imports/api/favorites/FavoritesCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Favorites.removeAll();
}
