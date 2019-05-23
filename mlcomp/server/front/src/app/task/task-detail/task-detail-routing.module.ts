import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TaskDetailComponent} from "./task-detail/task-detail.component";
import {LogComponent} from "../../log/log.component";
import {ReportDetailComponent} from "../../report/report-detail/report-detail/report-detail.component";
import {StepComponent} from "./step/step.component";

const routes: Routes = [
    {

        path: '',
        component: TaskDetailComponent,
        children: [
            {path: 'log', component: LogComponent},
            {path: 'step', component: StepComponent},
            {path: '', component: ReportDetailComponent}
        ]


    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class TaskDetailRoutingModule {
}