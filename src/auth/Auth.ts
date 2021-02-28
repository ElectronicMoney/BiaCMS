import {User} from '../models/User';
import {sign} from 'jsonwebtoken';

export class Auth { 
    //field 
    accessToken:string; 
    refreshToken:string; 
  
    //constructor 
    constructor() { 
       this.accessToken  = process.env.ACCESS_TOKEN_SECRETE!;
       this.refreshToken = process.env.REFRESH_TOKEN_SECRETE!;
    }  
 
    //createAccessToken 
    createAccessToken(user:User) {
        return sign({user: user}, this.accessToken, {expiresIn: '1d'});
    }

    //createRefreshToken 
    createRefreshToken(user: User) {
        return sign({user: user}, this.refreshToken, {expiresIn: '7d'});
    }
}