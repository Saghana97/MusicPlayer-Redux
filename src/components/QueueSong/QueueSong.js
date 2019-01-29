import React, { Component } from "react";
import "./QueueSong.css";
import { connect } from 'react-redux';
import { addAlbum, addQueue } from "../../actions/index";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

//queuesong sets the song details to be played in the queue
class QueueSong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      playingSong: "",
      playingSongName: "",
      isFirstPlaying: true,
      queue: this.props.Queue
    };
  }
  renderPlayer = (e, args) => {
    this.setState({ render: true });
    let name = this.state.queue[args].QueueSong_name;
    let song = this.state.queue[args].Queue_Song;
    this.setState({
      playingSongName: name,
      playingSong: song
    });
  };

  render() {
    return (
      <div
        className="queue-song-wrapper"
        onClick={e => this.renderPlayer(e, this.props.id)}>
        <div className="song_name">
          <div className="song_title">{this.props.name}</div>
          <div className="song_artist">{this.props.artist_name}</div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  album: [...state.posts.album],
  Queue: [...state.posts.Queue]
})
export default connect(mapStateToProps, { addAlbum, addQueue })(QueueSong);
