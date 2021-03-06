import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToOne
} from "typeorm";
import {User} from './User';


@Entity({'name': 'profiles'})
export class Profile extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    profileId!: string;
    
    @Column({ length: 200})
    name!: string;

    @Column({ default:'avatar.png'})
    avatarUrl!: string;

    @Column('text', {default: null})
    about!: string

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(
        () => User, user => user.profile,
        {onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    user!: Promise<User>;


    // Create Profile
    async createProfile(profilePaylaod: any): Promise<Profile> {
        // Create the instance of a Profile
        const profile = new Profile()

        // profile.userId   = profilePaylaod.userId;
        profile.profileId   = profilePaylaod.profileId;
        profile.name        = profilePaylaod.name;
        profile.user        = profilePaylaod.user;

        const newProfile = await profile.save();

        return newProfile; 
    }

}