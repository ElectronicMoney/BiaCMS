import {User} from '../models/User';
import {sign} from 'jsonwebtoken';
import {
    ACCESS_TOKEN_SECRETE,
    REFRESH_TOKEN_SECRETE
} from '../config'


export class Auth { 
    //field 
    accessTokenSecrete:string; 
    refreshTokenSecrete:string; 
    userId:string; 
  
    //constructor 
    constructor() { 
       this.accessTokenSecrete  = ACCESS_TOKEN_SECRETE!;
       this.refreshTokenSecrete = REFRESH_TOKEN_SECRETE!;
       this.userId = ''
    }  
 
    //createAccessToken 
    createAccessToken(user:User) {
        this.userId = user.userId
        return sign({userId: this.userId}, this.accessTokenSecrete, {expiresIn: '15m'});
    }

    //createRefreshToken 
    createRefreshToken(user: User) {
        this.userId = user.userId
        return sign({userId: this.userId}, this.refreshTokenSecrete, {expiresIn: '7d'});
    }
    
}