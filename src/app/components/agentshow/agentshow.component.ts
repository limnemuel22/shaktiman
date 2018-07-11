import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Agent } from '../../model/schema';

@Component({
  selector: 'app-agentshow',
  templateUrl: './agentshow.component.html',
  styleUrls: ['./agentshow.component.css']
})
export class AgentshowComponent implements OnInit {

  transaction:Agent;
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
    this.getAgent();
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

  getAgent(){
     this.dbService.get("agent",this.id).subscribe(data =>{
       this.transaction = data[0];
     });
   };

   goBack(){
    this.router.navigate(['/admin/agent/agent-list']);
  }

}
