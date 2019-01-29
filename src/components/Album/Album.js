import React, { Component } from "react";
import "./Album.css";
import data from "../../helpers/data";
import AlbumDetail from "../AlbumDetail/AlbumDetail.css";
import { Dialog } from "@material-ui/core";
import { connect } from 'react-redux';
import QueueSong from "../QueueSong/QueueSong";
import AlbumContent from "../AlbumContent/AlbumContent";
import AudioPlayer from "../AudioPlayer/AudioPlayer.css";
import { addAlbum, addQueue } from "../../actions/index";

//storing the file in a base 64 format
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

//component album for the player
class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      album_text: "",
      album_image: "",
      data: data,
      currentSongName: "",
      queue: this.props.Queue,
      callComponent: false,
      modalOpen: false,
      currentAlbumIndex: null,
      currentSongList: [],
      playSongIndex: null,
      render: false,
      currentSong: "",
      loop: false,
      cover_image: [],
      editStatus: false,
      editIndex: "",
      previousAlbumName: "",
      previousAlbumImage: ""
    };
  }
  //getting the details of the album
  getDetail = (e, index, songs) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      modalOpen: true,
      currentAlbumIndex: index,
      currentSongList: songs
    });
  };


  handleSecondClose = () => {
    this.setState({ modalOpen: false });
  };
  //setting state for the album
  addAlbum = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  //getting the name of the album
  getName = e => {
    this.setState({ album_text: e.target.value });
  };
  //function to add the data to the album content
  addToData = () => {
    if (this.state.album_text.length !== 0 && this.state.album_image) {
      data.push({
        album_name: this.state.album_text,
        album_image: this.state.album_image,
        songs: []
      });
      this.setState({ album_text: "", album_image: "" });
      this.setState({ open: false });
      this.props.addAlbum(this.state.data);
    } else {
      alert("cannot add");
    }
  };

  //get the file and store it in a base 64 format
  getFile = e => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      this.setState({ album_image: base64 });
    });
  };

  addEditData = e => {

    this.setState({
      previousAlbumName: data[this.state.editIndex].album_name,
      previousAlbumImage: data[this.state.editIndex].album_image
    });

    if (this.state.album_text) {
      data[this.state.editIndex].album_name = this.state.album_text;
    }
    if (this.state.album_image) {
      data[this.state.editIndex].album_image = this.state.album_image;
    }
    this.setState({
      album_text: "",
      album_image: ""
    });
    var temp = this.state.cover_image;

    for (var i = 0; i < temp.length; i++) {
      if (this.state.previousAlbumImage === temp[i]) {
        temp[i] = this.state.album_image;
      }
    }
    this.props.addAlbum(this.state.data);
    this.setState({ cover_image: temp });
    this.setState({ editStatus: false });
  };

  componentWillReceiveProps() {
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillMount() {
  }
  //function to delete the album
  deleteAlbum = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    let queue = this.props.Queue;
    for (var i = 0; i < this.props.album[index].songs.length; i++) {
      queue = queue.filter(eachSong => eachSong.song_id !== this.props.album[index].songs[i].song_id)
    }
    queue = queue.filter(eachSong => eachSong.song_id !== this.props.album[this.props.albumIndex].songs[index].song_id)
    this.state.data.splice(index, 1);
    this.setState({
      data: this.state.data
    });
    this.props.addQueue(queue);
    this.props.addAlbum(this.state.data);

  };

  //function
  editAlbum = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ editIndex: index });
    this.setState({ editStatus: true });
    this.props.addAlbum(this.state.data);
  };

  handleEditClose = () => {
    this.setState({ editStatus: false });
  };

  clearQueue = () => {
    this.setState({
      playSongIndex: "",
      currentSong: "",
      currentSongName: "",
      queue: []
    });
    this.props.addQueue(this.state.queue);
  };

  songClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ playSongIndex: index });
    this.setState({ currentSong: this.props.Queue[index].Queue_Song, currentSongName: this.props.Queue[index].QueueSong_name });
  };

  playNext = e => {
    e.stopPropagation();
    e.preventDefault();
    let nextId = this.state.playSongIndex;
    if (nextId + 1 >= this.props.Queue.length) {
      nextId = 0

    } else {
      nextId = this.state.playSongIndex + 1;
    }
    this.setState({
      playSongIndex: nextId,
      currentSong: this.props.Queue[nextId].Queue_Song,
      currentSongName: this.props.Queue[nextId].QueueSong_name
    });
  };

  playPrevious = e => {
    e.stopPropagation();
    e.preventDefault();
    let previousId = this.state.playSongIndex;
    if (previousId - 1 < 0) {
      previousId = this.props.Queue.length - 1;

    } else {
      previousId = this.state.playSongIndex - 1;
    }
    this.setState({
      playSongIndex: previousId, currentSong: this.props.Queue[previousId].Queue_Song,
      currentSongName: this.props.Queue[previousId].QueueSong_name
    });
  };

  loopSong = e => {
    this.setState({ loop: !this.state.loop });
  };
  //add all the songs to the queue
  addAllToQueue = () => {
    const { data, queue_name, artist_name, cover_image } = this.state;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].songs.length; j++) {
        if (data[i].songs[j].song) {
          this.state.queue.push({
            Queue_Song: data[i].songs[j].song,
            QueueSong_name: data[i].songs[j].song_name,
            QueueArtist_name: data[i].songs[j].artist_name,
            song_id: data[i].songs[j].song_id
          });
          cover_image.push(data[i].album_image);
        }
      }
    }
    this.props.addQueue(this.state.queue);
    this.setState({ open: true });
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="album-wrapper Maindiv">
        <div className="Contentdiv">
          <div className="heading">
            <p> Your Albums </p>
          </div>
          <div className="add-album">
            <button className="add" onClick={this.addAlbum}>
              Add new album
            </button>
            <button className="add" onClick={this.addAllToQueue}>
              Add all to queue
            </button>
          </div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            className="form-dialog"
          >
            <div className="form">
              <input
                type="text"
                id="album_name"
                className="input"
                placeholder="Album Name"
                onChange={this.getName}
              />
              <br />
              <p> Upload a cover image</p>
              <input
                type="file"
                name="pic"
                accept="image/*"
                className="input-file"
                onChange={this.getFile}
                id="picture"
              />
              <div className="button">
                <button className="add-album-button" onClick={this.addToData}>
                  Add
                </button>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={this.state.editStatus}
            onClose={this.handleEditClose}
            className="form-dialog"
          >
            <div className="form">
              <input
                type="text"
                id="album_name"
                className="input"
                placeholder="Album Name"
                onChange={this.getName}
              />
              <br />
              <p> Upload a cover image</p>
              <input
                type="file"
                name="pic"
                accept="image/*"
                className="input-file"
                onChange={this.getFile}
                id="picture"
              />
              <div className="button">
                <button
                  className="add-album-button"
                  onClick={e => this.addEditData(e)}
                >
                  Add
                </button>
              </div>
            </div>
          </Dialog>

          <div className="album-container">
            {this.props.album &&
              this.props.album.length > 0 &&
              this.props.album.map((datum, index) => (
                <div key={index}>
                  <div
                    className="album-detail-wrapper"
                    onClick={e => this.getDetail(e, index, datum.songs)}
                  >
                    <div
                      className="album-image"
                      style={{
                        backgroundImage: "url(" + datum.album_image + ")"
                      }}
                    />
                    <div className="album-name"> {datum.album_name} </div>
                    <div />
                    <button onClick={e => this.deleteAlbum(e, index)}>
                      Delete
                    </button>
                    <button onClick={e => this.editAlbum(e, index)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            <Dialog
              open={this.state.modalOpen}
              onClose={this.handleSecondClose}
            >
              <div className="content">
                <AlbumContent
                  albumIndex={this.state.currentAlbumIndex}
                  songs={this.state.currentSongList}
                  data={this.state.data}
                  queue={this.state.queue}
                  contentModal={this.state.modalOpen}
                  queueSongName={this.state.queue_name}
                  artistName={this.state.artist_name}
                  coverImage={this.state.cover_image}
                />
              </div>
            </Dialog>
          </div>
        </div>
        <div className="Queuediv">
          <p className="playListSongs"> Your Playlist </p>
          <button onClick={this.clearQueue}> Clear Queue </button>
          {this.props.Queue &&
            this.props.Queue.map((song, index) => (
              <div
                className="song-list"
                onClick={e => this.songClick(e, index)}
                key = {index}
              >
                <QueueSong
                  name={song.QueueSong_name}
                  id={index}
                  artist_name={song.QueueArtist_name}
                  playSong={song.Queue_Song}
                  allSongs={this.props.Queue}
                  allSongsName={this.props.Queue}
                />
              </div>
            ))}
        </div>
        <div className="audio-wrapper">
          <img
            src={this.state.cover_image[this.state.playSongIndex]}
            alt=""
            className="cover-image"
          />
          <p>{this.state.currentSongName}</p>
          <i
            className={
              this.state.loop ? "fas fa-retweet active" : "fas fa-retweet"
            }
            onClick={e => this.loopSong(e)}
          />
          <i className="fas fa-backward" onClick={e => this.playPrevious(e)} />
          <audio
            id="player"
            controls
            autoPlay
            preload="auto"
            key={this.state.currentSong}
            src={
              this.state.currentSong ? this.state.currentSong : this.props.Queue.Queue_Song
            }
            loop={this.state.loop}
          >
            <source id="source" />
          </audio>
          <i className="fas fa-forward" onClick={e => this.playNext(e)} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  album: [...state.posts.album],
  Queue: [...state.posts.Queue]
})
export default connect(mapStateToProps, { addAlbum, addQueue })(Album);
