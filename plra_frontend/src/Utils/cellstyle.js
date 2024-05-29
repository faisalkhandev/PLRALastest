export const gridCellStyle = (theme, status) => {
  switch (status) {
    case "Approved":
      return {
        backgroundColor: theme.palette.primary[200],
        padding: "10px",
        color: theme.palette.primary.main,
        borderRadius: "90px",
      };
    case "Marked":
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "10px",
        color: theme.palette.warning.main,
        borderRadius: "90px",
      };
    case "Closed":
      return {
        backgroundColor: theme.palette.error[300],
        padding: "10px",
        color: theme.palette.error[600],
        borderRadius: "90px",
      };
      case "Close":
      return {
        backgroundColor: theme.palette.error[300],
        padding: "10px",
        color: theme.palette.error[600],
        borderRadius: "90px",
      };
    case "Rejected":
      return {
        backgroundColor: theme.palette.error[300],
        padding: "10px",
        color: theme.palette.error[600],
        borderRadius: "90px",
      };
    case "Reject":
      return {
        backgroundColor: theme.palette.error[300],
        padding: "10px",
        color: theme.palette.error[600],
        borderRadius: "90px",
      };
    case "Refer to DG":
      return {
        backgroundColor: theme.palette.primary[200],
        padding: "10px",
        color: theme.palette.primary.main,
        borderRadius: "90px",
      };
    case "Unapproved":
      return {
        backgroundColor: theme.palette.error[300],
        padding: "10px",
        color: theme.palette.error[600],
        borderRadius: "90px",
      };
    case "Pending":
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "10px",
        color: theme.palette.warning.main,
        borderRadius: "90px",
      };
    case "In Process":
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "10px",
        color: theme.palette.warning.main,
        borderRadius: "90px",
      };
    case "In process":
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "10px",
        color: theme.palette.warning.main,
        borderRadius: "90px",
      };
    case "Refer to Director HR":
      return {
        backgroundColor: theme.palette.primary[200],
        padding: "10px",
        color: theme.palette.primary.main,
        borderRadius: "90px",
      };
  }
};

export const approvalcellStyle = (status, theme) => {
  let backgroundColor, color;

  switch (status) {
    case "Approved":
      backgroundColor = theme.palette.primary[200];
      color = theme.palette.primary.main;
      break;
    case "Refer to DG":
      backgroundColor = theme.palette.primary[200];
      color = theme.palette.primary.main;
      break;
    case "Refer to Competent Authority":
      backgroundColor = theme.palette.primary[200];
      color = theme.palette.primary.main;
      break;
    case "Pending":
      backgroundColor = theme.palette.warning[300];
      color = theme.palette.warning.main;
      break;
    case "In process":
      backgroundColor = theme.palette.warning[300];
      color = theme.palette.warning.main;
      break;
    case "Refer to Director HR":
      backgroundColor = theme.palette.primary[200];
      color = theme.palette.primary.main;
      break;
    case "In Process":
      backgroundColor = theme.palette.warning[300];
      color = theme.palette.warning.main;
      break;
    case "Rejected":
      backgroundColor = theme.palette.error[300];
      color = theme.palette.error[600];
      break;
      case "Closed":
      backgroundColor = theme.palette.error[300];
      color = theme.palette.error[600];
      break;
    case "Unapproved":
      backgroundColor = theme.palette.error[300];
      color = theme.palette.error[600];
      break;
    default:
      backgroundColor = "black";
      color = "black";
  }

  return { backgroundColor, color };
};
