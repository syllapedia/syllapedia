import "./ErrorText.css";
import { Typography } from '@mui/material';

function ErrorText({error}: {error: string}) {
    return (
        <Typography className="error-text" color={"primary"}>
            {error}
        </Typography>
    )
}

export default ErrorText;