import { UserAuthenticationPayloadModel } from './UserAuthenticationPayload.model';

export interface UserAuthorized extends Request {
  user: UserAuthenticationPayloadModel;
}
