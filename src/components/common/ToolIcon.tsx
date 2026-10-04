import React from 'react';
import {
  Minimize2,
  Maximize2,
  FileImage,
  Image as ImageIcon,
  FileText,
  Files,
  FileArchive,
  Video,
  QrCode,
  SpellCheck,
  Type,
  Calendar,
  Activity,
  ShieldCheck,
  Link2,
  Eraser,
  Youtube,
  Crop,
  Wrench,
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'h-5 w-5' }) => {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'FileImage':
      return <FileImage className={className} />;
    case 'Image':
      return <ImageIcon className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Files':
      return <Files className={className} />;
    case 'FileArchive':
      return <FileArchive className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'SpellCheck':
      return <SpellCheck className={className} />;
    case 'Type':
      return <Type className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Link2':
      return <Link2 className={className} />;
    case 'Eraser':
      return <Eraser className={className} />;
    case 'Youtube':
      return <Youtube className={className} />;
    case 'Crop':
      return <Crop className={className} />;
    default:
      return <Wrench className={className} />;
  }
};
