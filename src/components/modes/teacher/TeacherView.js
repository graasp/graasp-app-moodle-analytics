import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './TeacherView.css';
import { getUsers } from '../../../actions';
// import CourseDate from './widgets/CourseDate';
import ActionBarChart from './widgets/ActionBarChart';
// import ActionBarChartPerTarget from './widgets/ActionBarChartPerTarget';

export class TeacherView extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      main: PropTypes.string,
      widget: PropTypes.string,
      paper: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    appInstanceResources: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static styles = (theme) => ({
    main: {
      textAlign: 'center',
      margin: theme.spacing(),
    },
    widget: {},
    paper: {
      width: 'auto',
      margin: theme.spacing(),
      padding: theme.spacing(3),
      textAlign: 'center',
      border: 1,
      borderColor: '#5050d2',
      borderStyle: 'solid',
      borderRadius: 20,
      backgroundColor: 'rgba(253,242,255,0.56)',
    },
    title: {
      ...theme.typography.h4,
      marginTop: 10,
      color: '#5050d2',
    },
  });

  render() {
    const { classes, appInstanceResources } = this.props;
    if (appInstanceResources.length > 0) {
      return (
        <div className={classes.main}>
          {/* Add events and announcements to the calendar */}
          {/* <Grid> */}
          {/*  <Paper className={classes.paper}> */}
          {/*    <Typography className={classes.title} gutterBottom> */}
          {/*      Weeks */}
          {/*    </Typography> */}
          {/*    <CourseDate /> */}
          {/*  </Paper> */}
          {/* </Grid> */}
          <Grid container>
            <Grid sm={6}>
              <Paper className={classes.paper}>
                <Typography className={classes.title} gutterBottom>
                  Actions Per Day
                </Typography>
                <ActionBarChart />
              </Paper>
            </Grid>
            {/* Choose the right target and change their names to significant values */}
            {/* <Grid sm={6}> */}
            {/*  <Paper className={classes.paper}> */}
            {/*    <Typography className={classes.title} gutterBottom> */}
            {/*      Actions Per Target */}
            {/*    </Typography> */}
            {/*    <ActionBarChartPerTarget /> */}
            {/*  </Paper> */}
            {/* </Grid> */}
          </Grid>
        </div>
      );
    }
    return (
      <Paper className={classes.paper}>
        <Typography className={classes.title} gutterBottom>
          Data is not available at the moment
        </Typography>
      </Paper>
    );
  }
}

// get the app instance resources that are saved in the redux store
const mapStateToProps = ({ users, appInstanceResources }) => ({
  // we transform the list of students in the database
  // to the shape needed by the select component
  studentOptions: users.content.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
  appInstanceResources: appInstanceResources.content,
});

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
