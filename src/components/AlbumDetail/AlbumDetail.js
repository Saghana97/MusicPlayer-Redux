import React, { Component } from "react";
import "./AlbumDetail.css";
// import AlbumContent from "../AlbumContent/AlbumContent";
import AlbumContent from "../AlbumContent/AlbumContent";
import Dialog from "@material-ui/core/Dialog";

//component to set the player content by getting the details of the album
class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }
  getDetail = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };
//gets the details of the album as the image and name
  render() {
    return (
      <div>
        <div className="album-detail-wrapper" onClick={this.getDetail}>
          <div
            className="album-image"
            style={{ backgroundImage: "url(" + this.props.album_image + ")" }}
          />
          <div className="album-name"> {this.props.album_name} </div>
        </div>
        <Dialog open={this.state.modalOpen} onClose={this.handleClose}>
          <div className="content">
            <AlbumContent
              albumIndex={this.props.albumIndex}
              songs={this.props.songs}
              data={this.props.data}
              queue={this.props.queue}
              contentModal={this.state.modalOpen}
              queueSongName={this.props.queueSongName}
              artistName={this.props.artistName}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default AlbumDetail;
