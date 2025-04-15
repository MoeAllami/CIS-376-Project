import mongoose, { Schema, Document, models } from 'mongoose';

export interface SavedVisualization extends Document {
  userEmail: string;
  type: 'sorting' | 'pathfinding';
  name: string;
  data: any;
  createdAt: Date;
}

const SavedVisualizationSchema = new Schema<SavedVisualization>({
    userEmail: { type: String, required: true },
    type: { type: String, enum: ['sorting', 'pathfinding'], required: true },
    name: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

export default models.SavedVisualization ||
  mongoose.model<SavedVisualization>('SavedVisualization', SavedVisualizationSchema);
