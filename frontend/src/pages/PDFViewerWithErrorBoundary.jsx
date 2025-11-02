import React, { Component } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

class PDFViewerWithErrorBoundary extends Component {
  static defaultProps = {
    fileUrl: '',
    onDocumentLoad: () => {},
    onDocumentError: () => {},
  };

  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    console.error('Error in PDFViewer:', error, info);
    this.setState({ hasError: true });
    this.props.onDocumentError(error);
  }

  render() {
    const { fileUrl, onDocumentLoad, onDocumentError } = this.props;
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    if (this.state.hasError) {
      return (
        <div className="text-red-600 text-lg">
          Failed to render PDF. Please try downloading the file.
        </div>
      );
    }

    return (
      <Worker workerUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          onDocumentLoad={onDocumentLoad}
          onDocumentError={onDocumentError}
        />
      </Worker>
    );
  }
}

export default PDFViewerWithErrorBoundary;