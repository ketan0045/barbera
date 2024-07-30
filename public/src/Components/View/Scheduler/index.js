
import { render } from "react-dom";
import "./index.css";
import * as React from "react";
import {
  Day,
  WorkWeek,
  Month,
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  Inject,
  TimelineViews,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { ApiGet, ApiPost, ApiPut, ApiDelete } from "../../../helpers/API/ApiData";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TimePickerComponent } from "@syncfusion/ej2-react-calendars";
import Radio from '@material-ui/core/Radio';
import { extend, L10n } from '@syncfusion/ej2-base';
import { SampleBase } from "./sample-base";
import * as dataSource from "./datasource.json";
import moment from "moment";
import InputMobile from "./InputMobile"
import AppointmentModal from "../Appointment/AppointmentModal";
import AddNewAppointmentModal from "../../Common/Modal/AddNewAppointmentModal"
import { v4 as uuidv4 } from "uuid";
import { get_Setting } from "../../../utils/user.util";
L10n.load({
  'en-US': {
    'schedule': {
      'saveButton': false,
      'cancelButton': false,
      'deleteButton': false,
      'newEvent': "Add New Appointment",
      'MORE DETAILS': false,
      "editEvent": "Edit Appointment",
    },
  }
});
/**
 * schedule resources group-editing sample
 */

export class GroupEditing extends SampleBase {
  constructor() {
    super(...arguments);
    this.state = {
      row: true,
      staff: [],
      data: [],
      services: [],
      customer: [],
      mobile: 0,
      name: "",
      startTime: "",
      endTime: "",
      isValid: "",
      selectStaff: "",
      allSelectedStaff: [],
      IsStaff: false
    };
    this.fields = {

      subject: { name: "name", validation: { required: true, } },
      location: { name: "serviceName", validation: { required: true } },
      // description: { name: "serviceId", validation: { required: true } },

      // startTime: { title: "From", name: "StartTime" },
      // endTime: { title: "To", name: "EndTime" }

      // subject: { name: "Subject", validation: { required: true } },
      // location: {
      //   name: "Location",
      //   validation: {
      //     required: true,
      //     regex: [
      //       "^[a-zA-Z0-9- ]*$",
      //       "Special character(s) not allowed in this field"
      //     ]
      //   }
      // },
      // description: {
      //   name: "Description",
      //   validation: {
      //     required: true,
      //     minLength: 5,
      //     maxLength: 500
      //   }
      // },
      // startTime: { name: "StartTime", validation: { required: true } },
      // endTime: { name: "EndTime", validation: { required: true } }
    };
    this.data = extend([], dataSource.resourceConferenceData, null, true);
  }

  getAllAppointmentData() {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"))
    if (userInfo && userInfo.role === "Staff") {
      let staffData = [];
      staffData.push(userInfo)
      let res3 = staffData && staffData.map((result, index) =>
        Object.assign(result, { Id: result._id }, { Colors: "#b2c702" }, { Text: result.firstName }, { Title: result.title })
      );  
      let resp =res3.filter((obj) => obj.firstName === "Unassign" ? null :obj);

      this.setState({ IsStaff: true });
      this.setState({ staff: resp });
    } else {
      ApiGet("staff/company/" + userInfo.companyId)
        .then((res) => {
          let res3 =
            res &&
            res.data.data.map((result, index) =>

              Object.assign(result, { Id: result._id }, { Colors: "#b2c702" }, { Text: result.firstName }, { Title: result.title })
            );
            let resp =res3.filter((obj) => obj.firstName === "Unassign" ? null :obj);
          this.setState({ staff: resp });
        })
        .catch((err) => {
          console.log("Error");
        });
    }

    ApiGet("appointment/company/" + userInfo.companyId)
      .then((res) => {
        let ress = res.data.data;
      
        let staff = [];
        const datas = ress.map((rep, index) => {
         
          Object.assign(
            rep,
            { Id: rep.staffId._id },
            {
              Subject: rep.name ,
            }, {
            staffId: rep.staffId._id
          },
            {
              serviceId: rep.serviceId
            },
            {
              serviceDetails: rep.serviceId
            },
            {
              staffDetails: rep.staffId
            },
            {
              serviceName: rep.serviceId.serviceName
            },
            { StartTime: moment(rep.startTime).subtract("minute", 330).local().toDate() },
            { EndTime: moment(rep.endTime).subtract("minute", 330).local().toDate() }
          );
          staff = staff.concat(rep);
        });

        const dndlist = staff

        this.setState({ loader: false });

        this.setState({ data: extend([], dndlist, null, true) });
      })
      .catch((err) => {
        console.log("Error");
      });
  }

  template(props) {

    return (
      <div className="tooltip-wrap">
        <div className="flex items-center">
          <div className="staff-profile">
            {/* <img src={require("./../../../assets/img/staff-profile.svg").default} /> */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "lightgrey",
                height: "50px",
                width: "50px",
              }}
            >
              <span className="font-size-h5 font-weight-bold text-white font-size-20">
                {props && props.Subject
                  ? props.Subject[0].toUpperCase()
                  : "A"}
              </span>
            </div>
          </div>
          <div className="pl-4">
            <p className="heading-title-text-color font-size-16 font-bold tracking-normal">
              {props && props.Subject}
            </p>
            <p className="heading-title-text-color font-size-16 font-medium tracking-normal mb-0">
              {props && props.mobile}
            </p>
          </div>
        </div>

        <div>
          {moment(props.StartTime).format("HH:mm")} - {moment(props.EndTime).format("HH:mm")}
        </div>
        <div>
          <div>
            <div>{props && props.serviceDetails && props.serviceDetails.serviceName}</div>
            <div>{props && props.serviceDetails && props.serviceDetails.amount} </div>
          </div>
          <div>
            <div>{props && props.serviceDetails && props.serviceDetails.duration} With {props && props.staffDetails && props.staffDetails.firstName + props.staffDetails.lastName}</div>
          </div>

          <div>
            <div>This Appointment was {props && props.type && props.type === "prebooking" ? "PreBooked" : "Walk-in"}</div>
          </div>

        </div>
      </div>
    );
  }

  componentDidMount() {
    // this.scheduleObj.scrollTo("12:00");
    // this.onChange();
 
    this.setState({ isValid: "false" })
    let userInfo = JSON.parse(localStorage.getItem("userinfo"))

    this.getAllAppointmentData();

    ApiGet("service/company/" + userInfo.companyId)
      .then((res) => {
        this?.setState({ services: res.data.data })
      })
      .catch((err) => {
        console.log("Error");
      });

      const SettingData = get_Setting()
      this?.setState({ startTime: SettingData?.storeTiming[0]?.starttime })
      this?.setState({ endTime: SettingData?.storeTiming[0]?.endtime })
      this?.setState({ interval: 60 })

    // ApiGet("setting/company/" + userInfo.companyId)
    //   .then((res) => {
       
    //     this.setState({ startTime: res.data.data[0].storeTiming[0].starttime })
    //     this.setState({ endTime: res.data.data[0].storeTiming[0].endtime })
    //     this.setState({ interval: 60 })
    //   })
    //   .catch((err) => {
    //     console.log("Error");
    //   });

    ApiGet("customer/company/" + userInfo.companyId)
      .then((res) => {
        this.setState({ customer: res?.data?.data })

      })
      .catch((err) => {
        console.log("Error");
      });
  }

  onActionBegin(args) {

    let data = args?.data instanceof Array ? args?.data[0] : args?.data;
    if (args?.requestType === "eventCreate") {
      let data = args?.data instanceof Array ? args?.data[0] : args?.data;
      let ISODate = new Date(`${data.StartTime} UTC`)
      let userInfo = JSON.parse(localStorage.getItem("userinfo"))

      let element = document.getElementById("walkin")
      let type = "";

      if (element?.checked === true) {
        type = "walkin"
      } else {
        type = "prebooking"
      }
      let finalData = {
        "name": data.name,
        "mobile": data.mobile,
        "type": type,
        "serviceId": data.serviceId,
        "staffId": data.staffId,
        "date": moment(ISODate).add("minute", 0),
        "isPromotional": data.sms,
        "companyId": userInfo.companyId,
        "status": 1
      }
      ApiPost("appointment/", finalData)
        .then((res) => {
          this.getAllAppointmentData();
          data = {};
          finalData = {};

        })
        .catch((err) => {
          console.log("Error");
        });

    }
    else if (args.requestType === "eventChange") {
      let data = args.data instanceof Array ? args.data[0] : args.data;
 
     
      let ISODate = new Date(`${data.StartTime} UTC`)
   
      let userInfo = JSON.parse(localStorage.getItem("userinfo"))

      // let element = document.getElementById("walkin")
      // let type = "";

      // if (element.checked === true) {
      //   type = "walkin"
      // } else {
      //   type = "prebooking"
      // }
      
      let staffId = data.staffId instanceof Array ? data && data.staffId[0] : data.staffId
      ApiGet("staff/" + staffId)
      .then((res) => {
       let NewStaff = res?.data?.data[0]?.firstName
          
      let finalData = {
        "name": data.name,
        "mobile": data.mobile,
        "type": data.type,
        "serviceId": data.serviceId,
        "staffId": staffId,
        "staff": NewStaff,
        "date": ISODate,
        "isPromotional": data.sms,
        "companyId": userInfo.companyId,
        "status": 1
      }
      ApiPut("appointment/" + data._id, finalData)
        .then((res) => {
          this.getAllAppointmentData();
          data = {}
          finalData = {}
        })
        .catch((err) => {
          console.log("Error");
        });

      })
      .catch((err) => {
        console.log("Error");
      });
   
    }
    else if (args.requestType === "eventRemove") {
      let data = args.data instanceof Array ? args.data[0] : args.data;
      let finalData = {
        "status": 0
      }
      ApiPut("appointment/" + data._id, finalData)
        .then((res) => {
          this.getAllAppointmentData();

        })
        .catch((err) => {
          console.log("Error");
        });
    }
    // if (!this.scheduleObj.isSlotAvailable(data.StartTime, data.EndTime)) {
    //   args.cancel = true;
    // }
  }

  getEmployeeName(value) {
    return value.resourceData
      ? value.resourceData[value.resource.textField]
      : value.resourceName;
  }
  getEmployeeImage(value) {
    let resourceName = this.getEmployeeName(value);
    return resourceName.replace(" ", "-").toLowerCase();
  }
  getEmployeeDesignation(value) {
    let resourceName = this.getEmployeeName(value);
    return resourceName === "Margaret"
      ? "Sales Representative"
      : resourceName === "Robert"
        ? "Vice President, Sales"
        : "";
  }
  monthEventTemplate(props) {
    return <div className="subject">{props.Subject}</div>;
  }
  resourceHeaderTemplate(props) {

    return (
      <div className="template-wrap">
        <div className={"resource-image " + this.getEmployeeImage(props)}></div>
        <div className="resource-details">
          <div className="resource-name">{this.getEmployeeName(props)}</div>
          <div className="resource-designation">
            {this.getEmployeeDesignation(props)}
          </div>
        </div>
      </div>
    );
  }
  editAppointmentModaltoggle(e) {
    this.setState({ editAppointmentmodal: false })
  }

  handleSubmit(data) {
    if (data && data[0]._id) {
      ApiPut("appointment/" + data[0]._id, data[0])
        .then((res) => {
          this.getAllAppointmentData();
          data = {}
          this.scheduleObj.closeEditor();
       
        })
        .catch((err) => {
          console.log("Error");
        });
    } else {
      ApiPost("appointment/", data)
        .then((res) => {
          this.getAllAppointmentData();
          data = {};
          this.scheduleObj.closeEditor();
      
        })
        .catch((err) => {
          console.log("Error");
        });
    }

  }

  editorTemplate(props) {
    // this.setState({ editAppointmentmodal: true })
      
    const uuid = uuidv4();
    return props !== undefined ? (

      <div className="">
        <div class="">
          {/* <AddNewAppointmentModal args={props} addEvent={(values) => this.handleSubmit(values)}  /> */}
          <InputMobile editAppointment={props} IsStaff={this.state.IsStaff} args={props} startTime={this.state.startTime} endTime={this.state.endTime} addEvent={(values) => this.handleSubmit(values)} uuid={uuid}/>
        </div>
      </div>
    ) : (
      <div />
    );
  }
  SelectedStaff(e) {
    if (e.target.value === "alldata") {
      const staffSelect = this.state.staff
      this.setState({ allSelectedStaff: staffSelect });
    } else {
      const staffSelect = this.state.staff.filter((rep) => rep._id === e.target.value)
      this.setState({ allSelectedStaff: staffSelect });
    }
  }
  onEventRendered(args) {
    this.applyCategoryColor(args, this.scheduleObj.currentView);
  }
  applyCategoryColor(args, currentView) {
   
    let categoryColor = args && args.data&& args.data.serviceDetails&& args.data.serviceDetails.colour;
    if (!args.element || !categoryColor) {
      return;
    }
    if (currentView === "Agenda") {
      args.element.firstChild.style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }
  render() {
    return (
      <div className="schedule-control-section">

        <div className="control-section">
          {/* <div className="flex items-center justify-end calender-dropdown-style">
            <select type="text" className="rounded-full btn-fixed-header form-control dropdown-style1 font-medium dropdown2" onChange={(e) => this.SelectedStaff(e)}>
              <option value="alldata" className="font-size-18 font-medium">All Staff</option>
              {this.state.staff.map((rep) => {
                return (
                  <option className="font-size-18 font-medium" value={rep._id}>{rep.firstName}</option>)
              })}
            </select>
          </div> */}
          <div className="control-wrapper">
            <ScheduleComponent
              cssClass="group-editing"
              width="100%"
              height="calc(100vh - 130px)"
              enablePersistence={true}
              timeScale={{ enable: true, interval: this.state.interval, slotCount: this.state.interval/15 }}
              startHour={this.state.startTime ? this.state.startTime : "07:00"}
              endHour={this.state.endTime ? this.state.endTime : "19:00"}
              selectedDate= {new Date()}
              currentView="Day"
              ref={schedule => (this.scheduleObj = schedule)}
              resourceHeaderTemplate={this.resourceHeaderTemplate.bind(this)}
              editorTemplate={this.editorTemplate.bind(this)}
              eventRendered={this.onEventRendered.bind(this)}
              showQuickInfo={false}
              eventSettings={{
                dataSource: this.state.data,
                fields: this.fields,
                enableTooltip: false,
                tooltipTemplate: this.template.bind(this)
              }}
              actionBegin={this.onActionBegin.bind(this)}

              // readonly={true}
              group={{ allowGroupEdit: true, resources: ["Conferences"],
              //  enableCompactView: false  
               }}
            >
              <ResourcesDirective>
                <ResourceDirective
                  field="staffId"
                  title="Attendees"
                  name="Conferences"
                  allowMultiple={true}
                  dataSource={this.state.allSelectedStaff.length ? this.state.allSelectedStaff : this.state.staff}
                  textField="Text"
                  idField="Id"
                  colorField="Color"
                />
              </ResourcesDirective>

              <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="WorkWeek" />
                <ViewDirective
                  option="Month"
                  eventTemplate={this.monthEventTemplate.bind(this)}
                />
                <ViewDirective option="TimelineWeek" />
              </ViewsDirective>
              <Inject
                services={[
                  Day,
                  WorkWeek,
                  Month,
                  TimelineViews,
                  Resize,
                  DragAndDrop,
                ]}
              />
            </ScheduleComponent>
          </div>
          {/* <div style={{ display: "none" }}>
            <TimePickerComponent
              width={100}
              value={"12:00"}
              format="HH:mm"
              change={this.onChange.bind(this)}
            />
          </div> */}
        </div>
      </div>
    );
  }
}

// render(<GroupEditing />, document.getElementById('sample'));
export default GroupEditing;


