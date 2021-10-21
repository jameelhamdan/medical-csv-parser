import React from 'react';
import {Alert, Button, Form, ProgressBar} from "react-bootstrap";
import {API} from "../services/api";

export class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: "",
            progress: null,
            files: [],
            hospital: "hospital_1"
        }
    }

    setErrorMessage(msg) {
        this.setState({error: msg});
    }

    onUploadProgressCallback = (data) => {
        this.setState({progress: Math.round((100 * data.loaded) / data.total)});
    }

    submitHandler = (e) => {
        e.preventDefault();

        this.setErrorMessage("");
        this.setState({isLoading: true});
        API.createImportTask(this.hospital, this.state.files[0], this.onUploadProgressCallback).then(data => {
            // Do stuff on success
            //TODO: CHANGE THIS
            this.setErrorMessage("Uploaded successfully!");
        }).catch(err => {
            const message = err?.response?.data?.message;
            this.setState({progress: null});
            if (message) {
                this.setErrorMessage(message);
            } else {
                this.setErrorMessage("Sorry, An error happened on our side!")
            }
        }).finally(() => {
            this.setState({isLoading: false});
        });
    }

    render() {
        return (
            <>
                <h3>Upload CSV</h3>
                <form onSubmit={this.submitHandler}>
                    {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Control type="file" label="Select a CSV File" accept=".csv"
                            onChange={(e) => this.setState({files: e.target.files})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                    {!this.state.error && this.state.progress && (
                        <ProgressBar now={this.state.progress} label={`${this.state.progress}%`}/>
                    )}
                    </Form.Group>
                    <Form.Group>
                        <Button disabled={this.state.isLoading} variant="outline-primary" type="submit">Upload</Button>
                    </Form.Group>
                </form>
            </>
        );
    }
}