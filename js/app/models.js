/**
 * Created by chathura on 6/28/16.
 */
/**
 * X Axis time intervals
 * todo should be configurable in a future release
 */
var intervals = ["Daily", "Weekly", "Monthly", "Yearly"];
var intervalNoun = ["Days", "Weeks", "Months", "Years"];

/**
 * Local modals
 * */

function Options(){
    this.teiAttributes={//tracked entity instance attributes
        dob:null,
        gender:null
    }
}

function Centile() {
    this.name;
    this.data = [];
    this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    this.selected = true;
}

function LongitudinalChart() {
    this.id;
    this.title;//title of the chart
    this.program;//program Id
    this.yAxisVariable1;
    this.yAxisVariable2;
    this.xAxisPeriod;
    this.centiles = [];
    this.img;
    this.dependantDataType = 0;

    this.enabled = false;

    //graphical configurations
    this.labels = [];
    this.series = [];
    this.data = [];
    this.dataColors = [];
    this.options = {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks:{
                    stepSize:0.5
                }
            }]
        }
    };
}