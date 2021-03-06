import {Component} from '@angular/core';
import {Paginator} from "../paginator";
import {Model, ModelFilter} from "../models";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ModelService} from "./model.service";
import {
    MatDialog,
    MatIconRegistry
} from "@angular/material";
import {Helpers} from "../helpers";
import {DomSanitizer} from "@angular/platform-browser";
import {ModelStartDialogComponent} from "./model-start-dialog.component";
import {ModelAddDialogComponent} from "./model-add-dialog.component";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
    selector: 'app-model',
    templateUrl: './model.component.html',
    styleUrls: ['./model.component.css']
})
export class ModelComponent extends Paginator<Model> {
    protected displayed_columns: string[] = [
        'project',
        'dag',
        'id',
        'name',
        'created',
        'score_local',
        'score_public',
        'links'
    ];
    name: string;
    project: number;

    filter_hidden: boolean = true;
    filter_applied_text: string;
    projects: any[];

    created_min: string;
    created_max: string;

    constructor(protected service: ModelService,
                protected location: Location,
                protected router: Router,
                protected  route: ActivatedRoute,
                iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer,
                public start_dialog: MatDialog,
                public model_add_dialog: MatDialog,
                public dialog: MatDialog
    ) {
        super(service, location);

        iconRegistry.addSvgIcon('edit',
            sanitizer.bypassSecurityTrustResourceUrl(
                'assets/img/edit.svg'));

        iconRegistry.addSvgIcon('start',
            sanitizer.bypassSecurityTrustResourceUrl(
                'assets/img/play-button.svg'));

        iconRegistry.addSvgIcon('remove',
            sanitizer.bypassSecurityTrustResourceUrl(
                'assets/img/trash.svg'));

    }

    protected _ngOnInit() {
        let self = this;
        this.data_updated.subscribe(res => {
            if (!res || !res.projects) {
                return;
            }
            self.projects = res.projects;
            self.projects.splice(0, 0,
                {'id': -1, 'name': 'None'});
        });

    }

    get_filter(): any {
        let res = new ModelFilter();
        res.paginator = super.get_filter();
        res.paginator.sort_column = 'created';

        res.name = this.name;
        if (this.project != -1) {
            res.project = this.project;
        }
        res.created_min = Helpers.parse_time(this.created_min);
        res.created_max = Helpers.parse_time(this.created_max);
        return res;
    }

    onchange() {
        this.change.emit();
        let count = 0;
        if (this.name) count += 1;
        if (this.project && this.project != -1) count += 1;
        if (this.created_min) count += 1;
        if (this.created_max) count += 1;
        this.filter_applied_text = count > 0 ? `(${count} applied)` : '';
    }


    remove(element: Model) {
        let self = this;
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '550px', height: '200px',
            data: {
                'message': 'The all content will be deleted. ' +
                    'Do you want to continue?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.remove(element.id).subscribe(res => {
                    self.change.emit();
                });
            }
        })
    }


    start(element: Model) {
        let config = {
            width: '1050px', height: '800px',
            data: {
                'model_id': element.id
            }
        };
        let dialog = this.start_dialog.open(ModelStartDialogComponent, config);
        dialog.afterClosed().subscribe(res => this.change.emit());
    }

    add() {
        let dialog = this.model_add_dialog.open(ModelAddDialogComponent,
            {
                width: '500px', height: '400px',
                data: {
                    'projects': this.projects.filter(x => x.name != 'None'),
                    'equations': '',
                    'name': '',
                    'file': ''
                }
            });
        dialog.afterClosed().subscribe(res => this.change.emit());
    }
}



