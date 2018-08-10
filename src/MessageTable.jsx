import Widget from "@wso2-dashboards/widget";
import VizG from 'react-vizgrammar';
import { Scrollbars } from 'react-custom-scrollbars';
import { MuiThemeProvider, darkBaseTheme, getMuiTheme } from 'material-ui/styles';
import _ from 'lodash';
import moment from 'moment';
let TENANT_ID = '-1234';

class MessageTable extends Widget {
    constructor(props) {
        super(props);

        this.props.glContainer.setTitle(
            "Messages"
        );

        this.chartConfig = {
            "charts": [
                {
                    "type": "table",
                    "columns": [
                        {
                            "name": "messageId",
                            "title": "Message ID"
                        },
                        {
                            "name": "host",
                            "title": "Host"
                        },
                        {
                            "name": "startTime",
                            "title": "Start Time"
                        },
                        {
                            "name": "status",
                            "title": "Status"
                        }
                    ]
                }
            ],
            "pagination": true,
            "filterable": true,
            "append": false
        };

        this.metadata = {
            "names": [
                "messageId",
                "host",
                "startTime",
                "status"
            ],
            "types": [
                "ordinal",
                "ordinal",
                "time",
                "ordinal"
            ]
        };

        this.state = {
            data: [],
            metadata: this.metadata,
            width: this.props.glContainer.width,
            height: this.props.glContainer.height,
            btnGroupHeight: 100,
            clearGraph: true,
        };
        this.handleResize = this.handleResize.bind(this);
        this.props.glContainer.on('resize', this.handleResize);
        this.handleStats = this.handleStats.bind(this);
        this.handleGraphUpdate = this.handleGraphUpdate.bind(this);
        this.handlePublisherParameters = this.handlePublisherParameters.bind(this);
        this.getCurrentPage = this.getCurrentPage.bind(this);
        this.getUrlParameter = this.getUrlParameter.bind(this);

    }
    handleResize() {
        this.setState({ width: this.props.glContainer.width, height: this.props.glContainer.height });
    }

    componentWillMount() {
        super.subscribe(this.handlePublisherParameters);
    }

    handlePublisherParameters(message) {
        if ('granularity' in message) {
            // Update time parameters and clear existing graph
            this.setState({
                // timeFromParameter: moment(message.from).format("YYYY-MM-DD HH:mm:ss"),
                // timeToParameter: moment(message.to).format("YYYY-MM-DD HH:mm:ss"),
                timeFromParameter: message.from,
                timeToParameter: message.to,
                timeUnitParameter: message.granularity,
                clearGraph: true // todo: rename (isLoading)
            }, this.handleGraphUpdate);
        }
    }

    handleGraphUpdate() {
        super.getWidgetConfiguration(this.props.widgetID)
            .then((message) => {

                // Get data provider sub json string from the widget configuration
                let dataProviderConf = MessageTable.getProviderConf(message.data);
                let query = dataProviderConf.configs.config.queryData.query;
                let pageName = this.getCurrentPage();
                let componentName;
                let componentType;
                let entryPoint;
                let componentIdentifier = "componentName";
                let urlParams = new URLSearchParams(window.location.search);

                if (urlParams.has('id')) {
                    componentName = this.getUrlParameter('id');
                }

                if (pageName == "api") {
                    componentType = "api";
                } else if (pageName == "proxy") {
                    componentType = "proxy service"
                } else {
                    if (urlParams.has('entryPoint')) {
                        entryPoint = this.getUrlParameter('entryPoint')
                    }
                    if (pageName == "mediator") {
                        componentType = "mediator";
                        componentIdentifier = "componentId";
                    } else if (pageName == "endpoint") {
                        componentType = "endpoint";
                    } else if (pageName == "sequence") {
                        componentType = "sequence";
                    } else if (pageName == "inbound") {
                        componentType = "inbound endpoint";
                    }
                }
                // Insert required parameters to the query string
                let formattedQuery = query
                    .replace("{{timeFrom}}", this.state.timeFromParameter)
                    .replace("{{timeTo}}", this.state.timeToParameter)
                    .replace("{{metaTenantId}}", TENANT_ID)
                    .replace("{{componentType}}", componentType)
                    .replace("{{componentIdentifier}}", componentIdentifier)
                    .replace("{{componentName}}", componentName);
                dataProviderConf.configs.config.queryData.query = formattedQuery;

                // Request datastore with the modified query
                super.getWidgetChannelManager()
                    .subscribeWidget(
                        this.props.id, this.handleStats, dataProviderConf
                    );
            })
            .catch((error) => {
                // todo: Handle error
            });
    }

    static getProviderConf(widgetConfiguration) {
        return widgetConfiguration.configs.providerConfig;
    }


    handleStats(stats) {
        this.setState({
            metadata: stats.metadata,
            data: stats.data,
            clearGraph: false
        });
    }

    componentWillUnmount() {
        super.getWidgetChannelManager().unsubscribeWidget(this.props.id);
    }


    getCurrentPage() {
        let pageName;
        let href = parent.window.location.href;
        let lastSegment = href.substr(href.lastIndexOf('/') + 1);
        if (lastSegment.indexOf('?') == -1) {
            pageName = lastSegment;

        } else {
            pageName = lastSegment.substr(0, lastSegment.indexOf('?'));
        }
        return pageName;
    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <section style={{ paddingTop: 50 }}>
                    <VizG
                        config={this.chartConfig}
                        metadata={this.state.metadata}
                        data={this.state.data}
                        height={this.state.height - this.state.btnGroupHeight}
                        width={this.state.width}
                        theme={this.props.muiTheme.name}
                    />
                </section>
            </MuiThemeProvider>
        );
    }
}

global.dashboard.registerWidget("MessageTable", MessageTable);