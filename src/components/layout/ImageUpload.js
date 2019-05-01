import React, {Component} from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from "redux";
import { connect } from "react-redux";
import defaultImage from "./default.png";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: '',
      progress: 0
    }
    this.handleChange = this
      .handleChange
      .bind(this);
      this.handleUpload = this.handleUpload.bind(this);
  }
  handleChange = e => {
    if (e.target.files[0] && e.target.files[0].size < 5000000) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
    } else {
      alert("Image is larger than 5MB!");
    }
  }
  handleUpload = () => {
      const {image} = this.state;
      if (image) {
        const uploadTask = this.props.firebase.storage().ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed', 
        (snapshot) => {
          // progrss function ....
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.setState({progress});
        }, 
        (error) => {
             // error function ....
          console.log(error);
        }, 
      () => {
          // complete function ....
          this.props.firebase.storage().ref('images').child(image.name).getDownloadURL().then(url => {
              console.log(url);
              this.setState({url});
              this.props.firebase.updateProfile({ url: this.state.url });
          })
      });
      } else {
          alert("Please attach a new image! ");
      } 
  }
  render() {
    return (
      <div>
      <br/>
        <img src={this.props.profile.url || defaultImage}  height="200" width="200"/>
        <input 
            type="file" 
            onChange={this.handleChange} 
            className="btn btn-sm"
            accept="image/*"
            style={{ color: "#851941"}} 
             />
        <progress 
            value={this.state.progress} 
            max="100"
            style={{ color: "#851941"}} 
            /> <br />
        <input 
            onClick={this.handleUpload} 
            value="Upload" 
            type="submit"
            className="btn" 
            style={{ backgroundColor: "#851941", color: "#fff" }} 
        />
      </div>
    )
  }
}

export default compose(
    firebaseConnect(),
    connect((state, props) => ({
        profile: state.firebase.profile,
      })),
)(ImageUpload);