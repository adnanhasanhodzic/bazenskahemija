export type AppTab = 'home' | 'my-pool' | 'calculator' | 'water-test' | 'my-products' | 'settings';

export interface TabItem {
  id: AppTab;
  label: string;
  iconName: string;
}
