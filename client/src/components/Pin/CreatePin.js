import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from '../../context';

const CreatePin = ({ classes }) => {

  const { dispatch } = useContext(Context);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const handleDeleteDraft = () => {

    // clear local state
    setTitle("")
    setImage("")
    setContent("")

    // clear global state (draft pin)
    dispatch({ type: "DELETE_DRAFT" })
  }

  const handleSubmit = event => {
    event.preventDefault();
    console.log({title, image, content})
  }
  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary">
        <LandscapeIcon className={classes.iconLarge} /> Pin a Location
      </Typography>
      <div>
        <TextField 
          name="tite"
          label="title"
          placeholder="insert pin title"
          onChange={ e => setTitle(e.target.value) }
        />
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
            disabled={!title.trim() || !content.trim() || !image}
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
