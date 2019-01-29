import React, { Component } from "react";
import "./AlbumContent.css";
import { Dialog } from "@material-ui/core";
import { connect } from 'react-redux';
import { addAlbum, addQueue } from "../../actions/index";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import queue from "../../helpers/queue";

//converting the file uploaded to a base 64 format
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};
let count = 0;
class AlbumContent extends Component {
  componentDidMount() { }
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      song_name: "",
      artist_name: "",
      song: "",
      song_id: count,
      queue: [],
      play: false,
      editSong: false,
      editIndex: "",
      prevSongName: "",
      prevArtistName: "",
      prevSong: "",
    };
  }
  //function to add the songs
  adding = () => {
    this.setState({ modalOpen: true });
  };
  //function to close
  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  //function to close edit modal
  editClose = () => {
    this.setState({ editSong: false });
  };

  //function to set the song name with a value
  getName = e => {
    this.setState({ song_name: e.target.value });

  };
  //function to get the artist name
  getArtist = e => {
    this.setState({ artist_name: e.target.value });
  };
  //add the song in the base64 format
  addSong = e => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      this.setState({ song: base64 });
    });
  };

  //function to delete the song
  deleteSong = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ modalOpen: true });
    this.setState({ modalOpen: false });
    let queue = this.props.Queue;

    queue = queue.filter(eachSong => eachSong.song_id !== this.props.album[this.props.albumIndex].songs[index].song_id)

    this.props.songs.splice(index, 1);
    this.props.addAlbum(this.props.data);
    this.props.addQueue(queue);

  };

  //function to edit song
  editSong = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ editIndex: index });
    this.setState({ editSong: true });
    this.props.addAlbum(this.props.data);
  };

  //function to play the song
  playSong = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ play: true });
  };

  componentDidUpdate() {
  }
  //add the song name,artist and song to data
  addToData = () => {
    const { song_name, artist_name, song, song_id } = this.state;
    count = count + 1;
    if (this.state.song_name != 0 && this.state.artist_name != 0 && this.state.song.length != 0) {
      this.props.songs.push({
        song_name: song_name,
        artist_name: artist_name,
        song: song,
        song_id: count
      });
      this.props.addAlbum(this.props.data);
      this.setState({ song_name: "", artist_name: "", song: "" });
      this.setState({ modalOpen: false });
    } else {
      alert("Cannot add");
    }
  };

  //saving the edited data
  editComplete = e => {
    const { song_name, artist_name, song, editIndex } = this.state;

    let id = this.state.song_id;
    let prevSongName = this.props.songs[editIndex].song_name;
    let prevSong = this.props.songs[editIndex].song;
    let prevArtistName = this.props.songs[editIndex].artist_name;

    if (song_name) this.props.songs[editIndex].song_name = song_name;
    if (artist_name) this.props.songs[editIndex].artist_name = artist_name;
    if (this.song) this.props.songs[editIndex].song = song;

    this.props.addAlbum(this.props.data);
    let queue = this.props.Queue;
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].song_id == this.props.album[this.props.albumIndex].songs[editIndex].song_id) {
        queue[i].QueueSong_name = this.props.album[this.props.albumIndex].songs[editIndex].song_name;
        queue[i].QueueArtist_name = this.props.album[this.props.albumIndex].songs[editIndex].artist_name;
        queue[i].Queue_song = this.props.album[this.props.albumIndex].songs[editIndex].song;
      }
    }

    this.props.addQueue(queue);
    this.setState({ editSong: false });
    this.setState({ modalOpen: true });
    this.setState({ modalOpen: false });
  };

  //adding the songs to a queue
  addToQueue = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    let queue1 = this.props.Queue;
    const song_name = this.props.data[this.props.albumIndex].songs[index].song_name;
    const song = this.props.data[this.props.albumIndex].songs[index].song;
    const artist_name = this.props.data[this.props.albumIndex].songs[index].artist_name;
    const song_id = this.props.data[this.props.albumIndex].songs[index].song_id;
    queue1.push({
      Queue_Song: song,
      QueueSong_name: song_name,
      QueueArtist_name: artist_name,
      song_id: song_id
    });
    this.props.addQueue(queue1);
    this.props.coverImage.push(
      this.props.data[this.props.albumIndex].album_image
    );
    if (this.state.queue.length > 0) {
      this.setState({ play: true });
    }
  };
  //add the albums to the queue
  addAlbumToQueue = (e, index) => {
    let queue1 = this.props.Queue;
    for (var i = 0; i < this.props.data[index].songs.length; i++) {
      if (
        this.props.data[index].songs[i].song &&
        this.props.data[index].songs[i].song_name &&
        this.props.data[index].songs[i].artist_name &&
        this.props.data[index].songs[i].song_id
      ) {
        queue1.push({
          Queue_Song: this.props.data[index].songs[i].song,
          QueueSong_name: this.props.data[index].songs[i].song_name,
          QueueArtist_name: this.props.data[index].songs[i].artist_name,
          song_id: this.props.data[index].songs[i].song_id
        });
        this.props.coverImage.push(this.props.data[index].album_image);
      }
    }
    this.props.addQueue(queue1);
    if (this.state.queue.length > 0) {
      this.setState({ play: true });
    }
  };
  render() {
    return (
      <div className="content-wrapper">
        <div className="add-songs">
          <br />
          <button onClick={this.adding}>Add Songs</button>
          {this.props.Queue.length > 0 && (
            <button
              onClick={e => this.addAlbumToQueue(e, this.props.albumIndex)}
            >
              Add All Songs to Queue
            </button>
          )}
          <Dialog
            open={this.state.modalOpen}
            onClose={this.handleClose}
            className="form-dialog"
          >
            <div className="form">
              <input
                type="text"
                id="song_name"
                className="input"
                placeholder="Song Name"
                onChange={this.getName}
              />
              <br />
              <input
                type="text"
                id="artist_name"
                className="input"
                placeholder="Artist Name"
                onChange={this.getArtist}
              />
              <br />
              <p> Upload the song</p>
              <input type="file" accept="audio/*" onChange={this.addSong} />
              <div className="button">
                <button className="add-song-button" onClick={this.addToData}>
                  Add
                </button>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={this.state.editSong}
            onClose={this.editClose}
            className="form-dialog"
          >
            <div className="form">
              <input
                type="text"
                id="song_name"
                className="input"
                placeholder="Song Name"
                onChange={this.getName}
              />
              <br />
              <input
                type="text"
                id="artist_name"
                className="input"
                placeholder="Artist Name"
                onChange={this.getArtist}
              />
              <br />
              <p> Upload the song</p>
              <input type="file" accept="audio/*" onChange={this.addSong} />
              <div className="button">
                <button className="add-song-button" onClick={this.editComplete}>
                  Add
                </button>
              </div>
            </div>
          </Dialog>
        </div>
        <div className="songs-list">
          {this.props.album != undefined ?
            this.props.album[this.props.albumIndex].songs.map((song, index) => (
              <div className="song" key={index}>
                <div className="song-name">
                  <div className="classForSong">
                    <span className="text">{song.song_name} </span>
                    <span className="artist">{song.artist_name} </span>
                  </div>
                  <button
                    className="delete_song"
                    onClick={e => this.deleteSong(index, e)
                    }
                  >
                    X
                  </button>
                  <button
                    className="queue_button"
                    onClick={e => this.addToQueue(e, index)}
                  >
                    + queue
                  </button>
                  <button
                    className="delete_song"
                    onClick={e => this.editSong(e, index)}>
                    Edit
                  </button>
                </div>
              </div>
            )) : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  album: [...state.posts.album],
  Queue: [...state.posts.Queue]
})
export default connect(mapStateToProps, { addAlbum, addQueue })(AlbumContent);
