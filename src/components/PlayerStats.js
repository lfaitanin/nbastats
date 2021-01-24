import React from "react";
import { connect } from "react-redux";

import Modal from "./Modal";
import history from "../history";
import { getAverage, getStats, getPlayerStat, getPlayer } from "../actions";

class PlayerStats extends React.Component {
  state = {
    showError: false
  };

  componentDidMount() {
    this.props.getAverage(this.props.match.params.id);
    setTimeout(() => {
      if (!this.props.average.length) {
        this.setState({ showError: true });
      }
    }, 500);
  }

  // Potentially think about using the componentDidUnmount lifecycle method to help destroy the piece of state as we click on more players
  renderTitle = () => {
    if (!this.props.player) {
      return "...Loading";
    } else {
      return (
        <div className="ui header">
          {this.props.player.first_name} {this.props.player.last_name}
        </div>
      );
    }
  };

  // Renders all content into the modal showing as a table
  renderContent = () => {
    if (this.state.showError) {
      return (
        <h1>
          Player is inactive or retired{" "}
          <span role="img" aria-label="emoji">
            😞
          </span>
        </h1>
      );
    } else {
      return this.props.average.map(avg => {
        return (
          <table key={avg.player_id} className="ui celled table">
            <thead>
              <tr>
                <th>Pontos</th>
                <th>Rebotes</th>
                <th>Assistencias</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="PTS">{avg.pts}</td>
                <td data-label="REB">{avg.reb}</td>
                <td data-label="ASS">{avg.ast}</td>
              </tr>
            </tbody>
          </table>
        );
      });
    }
  };

  //Close button
  renderActions() {
    return (
      <React.Fragment>
        <button onClick={this.handleClick} className="ui button negative">
          Fechar
        </button>
      </React.Fragment>
    );
  }

  handleClick = () => {
    return history.goBack();
  };

  render() {
    if (!this.props.average) {
      return (
        <div className="ui container">
          <p></p>
          <div className="ui active dimmer">
            <div className="ui loader"></div>
          </div>
        </div>
      );
    }

    return (
      <Modal
        title={this.renderTitle()}
        onDismiss={() => history.goBack()}
        content={this.renderContent()}
        actions={this.renderActions()}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    average: state.average,
    stats: state.stats,
    player: state.players[ownProps.match.params.id]
  };
};

export default connect(mapStateToProps, {
  getAverage,
  getStats,
  getPlayerStat,
  getPlayer
})(PlayerStats);
