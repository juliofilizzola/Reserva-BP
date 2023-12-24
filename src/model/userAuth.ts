import { UserAuthenticationPayloadModel } from './UserAuthenticationPayload.model';

export interface UserAuth extends Request {
  user: UserAuthenticationPayloadModel;
}
