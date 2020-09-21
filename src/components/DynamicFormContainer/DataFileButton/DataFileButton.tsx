import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson, readFileAsCsv } from "../../../common/utils";
import { Button } from "../../UI/Button";
import { ErrorAlert } from "../../Alert";
import { getLogger } from "../../../utils/logger";
import { useFormsContext } from "../../../common/context/forms";

const { stack } = getLogger("DataFileButton");
interface DataFileButton {
  onDataFile: (dataFile: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const DataFileButton: FunctionComponent<DataFileButton> = ({ onDataFile }) => {
  const { currentFormTemplate } = useFormsContext();
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      let data = null;
      if (file.name.indexOf(".csv") > 0) {
        // has to be > 0...
        data = await readFileAsCsv(file, currentFormTemplate?.headers);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = await readFileAsJson<any>(file);
      }
      setError(false);
      onDataFile(data);
    } catch (e) {
      stack(e);
      setError(true);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  return (
    <>
      {error && (
        <div className="my-2" data-testid="file-read-error">
          <ErrorAlert message="File cannot be read" />
        </div>
      )}
      <div data-testid="data-upload-zone" {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <Button
          data-testid="data-upload-button"
          className={`text-center w-full p-2 bg-white text-orange border-grey-lighter border-solid border h-12`}
        >
          Upload Data File
        </Button>
      </div>
    </>
  );
};
