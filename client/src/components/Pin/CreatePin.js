import React, { useState, useContext } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from '../../context';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../client';

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteDraft = () => {

    // clear local state
    setTitle("")
    setImage("")
    setContent("")

    // clear global state (draft pin)
    dispatch({ type: "DELETE_DRAFT" })
  }

  const handleImageUpload = async () => {
    // create form data
    const data = new FormData();
    // append the image we have stored in state as a file to data
    data.append("file", image);
    // upload preset is what cloudinary created for us when we
    // enabled unsigned uploading
    data.append("upload_preset", "mibi0rzt");
    // append cloudinary cloud name
    data.append("cloud_name", "dfddbhcyo");

    // make http request with axios
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dfddbhcyo/image/upload",
      data
    );

    return res.data.url
  }

  const handleSubmit = async event => {
    try {
      // prevent screen from auto refreshing upon submit
      event.preventDefault();
      setSubmitting(true);

      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude }
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables)
      
      console.log("pin created", { createPin })
      dispatch({ type: 'CREATE_PIN', payload: createPin })
      handleDeleteDraft();
    } catch (error) {
      setSubmitting(false)
      console.error("ERROR CREATING PIN", error)
    } 
  }

  return (
    <form className={classes.form}>
      {/* title */}
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary">
        <LandscapeIcon className={classes.iconLarge} /> Pin a Location
      </Typography>
      {/* input div (first row) */}
      <div>
        {/* pin title  */}
        <TextField 
          name="tite"
          label="title"
          placeholder="insert pin title"
          onChange={ e => setTitle(e.target.value) }
        />
        {/* image input  */}
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={ e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            style={{color: image && "green" }}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />>
          </Button>
        </label>
      </div>
      {/* input div (second row)  */}
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={ e => setContent(e.target.value)}
        />
        {/* save / discard buttons  */}
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleDeleteDraft}
          >
            <ClearIcon className={classes.leftIcon} />Discard
          </Button>

          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            disabled={!title.trim() || !content.trim() || !image || submitting}
            onClick={handleSubmit}
          >
            Submit<SaveIcon className={classes.rightIcon} />
          </Button>
        </div>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
