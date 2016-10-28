import { Component, OnInit } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { EmailValidator } from './email-validator'
import { Router, CanDeactivate, ROUTER_DIRECTIVES, RouteParams } from 'angular2/router'
import { UsersService } from './users.service'

@Component({
    selector: 'new-user',
    templateUrl: 'app/userform.component.html',
    providers: [UsersService],
    directives: [ROUTER_DIRECTIVES]
})
export class UserFormComponent implements OnInit, CanDeactivate {

    userId: string;
    title: string;
    user = { address: {} };

    form: ControlGroup;

    constructor(fb: FormBuilder, private _usersservice: UsersService, private _routerParams: RouteParams, private _router: Router) {
        this.form = fb.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                EmailValidator.validateIsEmail
            ])],
            phone: [''],
            address: fb.group({
                street: [''],
                apt: [''],
                city: [''],
                zipcode: ['']
            })
        })
    }

    ngOnInit() {

        this.userId = this._routerParams.get("id");

        this.title = this.userId ? "Edit User" : "New User";

        if (!this.userId)
            return

        this._usersservice.currentUser(this.userId)
            .subscribe(
            users => this.user = users,
            response => {
                if (response.status == 404) {
                    this._router.navigate(['Not Found']);
                }
            });

    }

    routerCanDeactivate(next, previous) {
        if (this.form.dirty)
            return confirm("Do you want to leave the new user form?")

    }

    saveUser(form) {
        this._usersservice.createUser(this.form.value)
            .subscribe(res => console.log(res))
        console.log(this.form.value)
    }

}