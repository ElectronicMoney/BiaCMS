import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn
} from "typeorm";

@Entity({'name': 'advertciements'})
export class Adverticement extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    advertId!: string;
    
    @Column({ length: 100, unique: true })
    name!: string;

    @Column({length: 200})
    advertUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;


    // Create Adverticement
    async createAdverticement(advertPaylaod: any): Promise<Adverticement> {
        // Create the instance of a advert
        const advert = new Adverticement()

        advert.advertId   = advertPaylaod.advertId;
        advert.name         = advertPaylaod.name;
        advert.advertUrl  = advertPaylaod.advertUrl;

        const newAdverticement     = await advert.save();

        return newAdverticement; 
    }

    // Get All Adverticements
    async getAdverticements(): Promise<Adverticement[]> {
        const adverts = await Adverticement.find();
        return adverts; 
    }

    // get A Adverticement
    async getAdverticement(advertId: string): Promise<Adverticement> {

        const advert = await Adverticement.findOne({where: {advertId: advertId} });
        return advert!; 
    }


    // Update A Adverticement
    async updateAdverticement(advertId: string, advertPayload: any): Promise<Adverticement> {

        const advert = await Adverticement.findOne({where: {advertId: advertId} });

        if(advertPayload.name) {
            advert!.name = advertPayload.name
        }

        if(advertPayload.advertUrl) {
            advert!.advertUrl  = advertPayload.advertUrl
        }
        const updatedAdverticement = await advert!.save();
        return updatedAdverticement; 
    }


    // Delete A Adverticement
    async deleteAdverticement (advertId: string): Promise<Adverticement> {
        const advert = await Adverticement.findOne({where: {advertId: advertId} });
        const deletedAdverticement = await advert!.remove();
        return deletedAdverticement
    }


    // Check if Adverticement Name exists
    async advertNameExist(name: string) {
        const advert = await Adverticement.findOne({where: {name: name} });
        return advert ? true : false
    }
}
