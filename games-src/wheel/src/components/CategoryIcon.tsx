import React from 'react';
import {
  Coins,
  Leaf,
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  Compass,
  Shuffle,
  Shield,
  Zap,
  RefreshCw,
  Flame,
  CloudRain,
  Trees,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  Users2,
  Eye,
  CheckCircle2,
  Scale,
  AlertTriangle,
  Truck,
  HelpCircle
} from 'lucide-react';

interface Props {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<Props> = ({ name, className = 'w-5 h-5', size }) => {
  switch (name) {
    case 'Coins':
      return <Coins className={className} size={size} />;
    case 'Leaf':
      return <Leaf className={className} size={size} />;
    case 'Users':
      return <Users className={className} size={size} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} size={size} />;
    case 'TrendingUp':
      return <TrendingUp className={className} size={size} />;
    case 'Award':
      return <Award className={className} size={size} />;
    case 'Compass':
      return <Compass className={className} size={size} />;
    case 'Shuffle':
      return <Shuffle className={className} size={size} />;
    case 'Shield':
      return <Shield className={className} size={size} />;
    case 'Zap':
      return <Zap className={className} size={size} />;
    case 'RefreshCw':
      return <RefreshCw className={className} size={size} />;
    case 'Flame':
      return <Flame className={className} size={size} />;
    case 'CloudRain':
      return <CloudRain className={className} size={size} />;
    case 'Trees':
      return <Trees className={className} size={size} />;
    case 'Heart':
      return <Heart className={className} size={size} />;
    case 'Briefcase':
      return <Briefcase className={className} size={size} />;
    case 'Home':
      return <Home className={className} size={size} />;
    case 'GraduationCap':
      return <GraduationCap className={className} size={size} />;
    case 'Users2':
      return <Users2 className={className} size={size} />;
    case 'Eye':
      return <Eye className={className} size={size} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} size={size} />;
    case 'Scale':
      return <Scale className={className} size={size} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} size={size} />;
    case 'Truck':
      return <Truck className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};
