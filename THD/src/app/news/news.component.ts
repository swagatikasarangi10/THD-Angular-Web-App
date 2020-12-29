import { NewsService } from '../service/news.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {


  myControl = new FormControl();
  data={"access":"public"}
  isCreateButton=false;
  isUpdateButton=false;
  createNewsForm: FormGroup;
  updateNewsForm: FormGroup;
  deleteNewsForm: FormGroup;
  news=[]
  options: any[]=['All News']
  filteredOptions: Observable<string[]>;

  CreateNews={
    "news_name": "",
    "news_desc": "",
    "news_date": "",
    "access": "public",
    "imageURL": "image",
    "iconName": "icon"

  };
  UpdateFullNews={
    "_id":"",
  "UpdateNews": {
    "_id":"",
    "news_name": "",
    "news_desc": "",
    "news_date": "",
    "access": "public",
    "imageURL": "image",
    "iconName": "icon"
  }
};

  DeleteNews={
    "_id":""
  };
  constructor(private _newsService:NewsService,private router:Router,private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.createNewsForm = this.formBuilder.group({
      newsname: ['', Validators.required],
      newsdesc: ['', Validators.required],
      newsdate: ['', Validators.required]
    });

    this.updateNewsForm = this.formBuilder.group({
      newsname: ['', Validators.required],
      newsdesc: ['', Validators.required],
      newsdate: ['', Validators.required]
    });

    this._newsService.getNews(this.data)
    .subscribe(
      res=>{
        this.news=res;
        for (var index1 in this.news) {
          this.options.push(this.news[index1].news_name)
        }

      },
      err=>{
        console.log(err)
        if (err instanceof HttpErrorResponse){
          if(err.status===401){
            this.router.navigate(['/login'])
          }
        }
      
      })

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }




  createNews(){

    this._newsService.createNews(this.CreateNews)
    .subscribe(res=>this.news=res,
      err=>{
        console.log(err)
        if (err instanceof HttpErrorResponse){
          if(err.status===401){
            this.router.navigate(['/login'])
          }
        }
      
      })
      this.isCreateButton=false;
  }

  
  updateNews(){
    this._newsService.updateNews(this.UpdateFullNews)
    .subscribe(res=>this.news=res,
      err=>{
        console.log(err)
        if (err instanceof HttpErrorResponse){
          if(err.status===401){
            this.router.navigate(['/login'])
          }
        }
      
      })
      this.isUpdateButton=false;
  }


  deleteNews(data: any){
    this.DeleteNews._id=data;
    console.log(this.DeleteNews._id);
    this._newsService.deleteNews(this.DeleteNews)
    .subscribe(res=>this.news=res,
      err=>{
        console.log(err)
        if (err instanceof HttpErrorResponse){
          if(err.status===401){
            this.router.navigate(['/login'])
          }
        }
      
      })
  }

  isCreate(){
    if(this.isCreateButton){
      this.isCreateButton=false;
    } 
    else{
      this.isCreateButton=true;
      this.isUpdateButton=false;
    }
  }

  isUpdate(data: any){
    if(this.isUpdateButton){
      this.isUpdateButton=false;
    } 
    else{
      this.isUpdateButton=true;
      this.isCreateButton=false;
    }
    this.UpdateFullNews._id=data;
    this.UpdateFullNews.UpdateNews._id=data;
    console.log(this.UpdateFullNews._id);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.options)
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


}
