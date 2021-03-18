import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany
} from "typeorm";
import {Post} from './Post';

@Entity({'name': 'categories'})
export class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    categoryId!: string;
    
    @Column({ length: 100, unique: true })
    name!: string;

    @Column('text')
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Post, post => post.category)
    posts!: Promise<Post[]>;


    // Create Category
    async createCategory(categoryPaylaod: any): Promise<Category> {
        // Create the instance of a category
        const category = new Category()

        category.categoryId   = categoryPaylaod.categoryId;
        category.name         = categoryPaylaod.name;
        category.description  = categoryPaylaod.description;

        const newCategory     = await category.save();

        return newCategory; 
    }

    // Get All Categorys
    async getCategories(): Promise<Category[]> {
        const categories = await Category.find();
        return categories; 
    }

    // get A Category
    async getCategory(categoryId: string): Promise<Category> {

        const category = await Category.findOne({where: {categoryId: categoryId} });
        return category!; 
    }


    // Update A Category
    async updateCategory(categoryId: string, categoryPayload: any): Promise<Category> {

        const category = await Category.findOne({where: {categoryId: categoryId} });

        if(categoryPayload.name) {
            category!.name = categoryPayload.name
        }

        if(categoryPayload.description) {
            category!.description  = categoryPayload.description
        }
        const updatedCategory = await category!.save();
        return updatedCategory; 
    }


    // Delete A Category
    async deleteCategory (categoryId: string): Promise<Category> {
        const category = await Category.findOne({where: {categoryId: categoryId} });
        const deletedCategory = await category!.remove();
        return deletedCategory
    }


    // Check if Category Name exists
    async categoryNameExist(name: string) {
        const category = await Category.findOne({where: {name: name} });
        return category ? true : false
    }
}
