import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Client } from '../../model/schema';

@Component({
  selector: 'app-clientshow',
  templateUrl: './clientshow.component.html',
  styleUrls: ['./clientshow.component.css']
})
export class ClientshowComponent implements OnInit {

  transaction:Client;
  id = this.route.snapshot.params['id'];
  form: FormGroup;
  textarea = true;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private dbService:DatabaseService,
    private formbuilder:FormBuilder
  ) {
    this.createForm();
    this.getClient();
   }

  ngOnInit() {
  }

  createForm(){
    this.form = this.formbuilder.group({
      name:[''],
      dtPO:[''],
      POnumber: [''],
      endUser: [''],
      purpose: [''],
      amount: ['']
    });
  }

  getClient(){
     this.dbService.get("client",this.id).subscribe(data =>{
       this.transaction = data[0];
     });
   };

   goBack(){
    this.router.navigate(['/admin/clients/clients-list']);
  }

}
