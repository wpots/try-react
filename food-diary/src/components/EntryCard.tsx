import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface EntryCardProps {
  foodEaten: string;
  description: string;
  time: string;
  entryType: string;
}

const EntryCard: React.FC<EntryCardProps> = ({ foodEaten, description, time, entryType }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {foodEaten}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {entryType} - {time}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default EntryCard;
