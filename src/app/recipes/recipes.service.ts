import { Injectable } from '@angular/core';
import { Recipe } from './recipes.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl: 'https://media.istockphoto.com/id/1340642632/photo/sunflowers.jpg?s=170667a&w=0&k=20&c=yVQkU_vonXZk0M0oLKRA1kKeEW3UCWceBdSDYv_sSmY=',
      ingredients: ['XXX-1', 'YYY-1', 'ZZZ-1']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrmJ5TcCtpN9X1cItD4w0PgRslGI2E6oyEYHMURVB21auh6l4iUFAWCKIOebMo-cfkNW0&usqp=CAU',
      ingredients: ['XXX-1', 'YYY-1']
    }
  ]

  constructor() { }

  getAllRecipes(){
    return [...this.recipes]
  }

  getRecipe(recipeId: string){
    //todo: Nếu tồn tại recipeId thì thực hiện
    return {
      ...this.recipes.find(recipe => {
        return recipe.id === recipeId
      })
    }
    // return this.recipes[recipeId]
  }

  deleteRecipe(recipeId: string){
    //todo: Lấy tất cả các phần tử thỏa mãn
    this.recipes = this.recipes.filter(recipe => {
      return recipe.id !== recipeId
    })
  }
}
