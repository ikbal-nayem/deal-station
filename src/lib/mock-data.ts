
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import type { Offer, Category, Tag } from './types';

export const mockCategories: ICommonMasterData[] = [
    { id: 'cat-1', name: 'Food & Drink' },
    { id: 'cat-2', name: 'Health & Wellness' },
    { id: 'cat-3', name: 'Shopping' },
    { id: 'cat-4', name: 'Entertainment' },
    { id: 'cat-5', name: 'Services' },
];

export const mockTags: ICommonMasterData[] = [
    { id: 'tag-1', name: 'Vegan' },
    { id: 'tag-2', name: 'Outdoor Seating' },
    { id: 'tag-3', name: 'Family Friendly' },
    { id: 'tag-4', name: 'Pet Friendly' },
    { id: 'tag-5', name: 'Happy Hour' },
];

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Kacchi Biryani Feast',
    description: 'Buy one Kacchi Biryani and get a free Borhani. The perfect royal meal.',
    fullDescription: 'Indulge in the flavor of kings at Dhaka Eats. We are offering a special deal on our famous Kacchi Biryani. This offer is valid every day from 1 PM to 4 PM.',
    companyName: 'Dhaka Eats',
    latitude: 23.7949, // Gulshan
    longitude: 90.4143,
    isMemberOnly: false,
    distance: '0.5 mi',
    discount: 'FREE',
    category: 'Food & Drink',
    organizationId: 'org-dhaka-eats',
  },
  {
    id: '2',
    title: '50% Off First Month of Gym',
    description: 'New members get 50% off their first month of unlimited gym access.',
    fullDescription: 'Start your fitness journey at Rangpur Fitness Center. We believe in a healthy lifestyle and want to make it accessible to everyone. As a new member, you\'ll receive a 50% discount on your first month of unlimited gym access. Explore various equipment and classes with our experienced trainers.',
    companyName: 'Rangpur Riders Cafe', // Using cafe as a proxy
    latitude: 25.7439, // Rangpur
    longitude: 89.2752,
    isMemberOnly: true,
    distance: '150 mi',
    discount: '50% OFF',
    category: 'Health & Wellness',
    organizationId: 'org-rangpur-riders',
  },
  {
    id: '3',
    title: 'Free Samosa with Tea',
    description: 'Enjoy a complimentary samosa with the purchase of any pot of tea.',
    fullDescription: 'Experience authentic Bengali tea culture at Chittagong Chai. Our teas are sourced from the finest gardens. For a limited time, receive a free freshly-made samosa with the purchase of any pot of tea. Perfect for an afternoon snack!',
    companyName: 'Chittagong Chai',
    latitude: 22.3569, // Chittagong
    longitude: 91.7832,
    isMemberOnly: false,
    distance: '160 mi',
    discount: 'FREE',
    category: 'Food & Drink',
    organizationId: 'org-chittagong-chai',
  },
  {
    id: '4',
    title: '25% Off All Bengali Literature',
    description: 'Expand your library with a 25% discount on our entire collection of Bengali books.',
    fullDescription: 'Get lost in a world of stories at Bohubrihi Books. We are an independent bookstore with a passion for literature. To celebrate our community, we are offering a 25% discount on all Bengali literature in the store. From classic novels to modern poetry, find your next great read with us.',
    companyName: 'Bohubrihi Books',
    latitude: 23.7265, // Nilkhet, Dhaka
    longitude: 90.3887,
    isMemberOnly: false,
    distance: '2.1 mi',
    discount: '25% OFF',
    category: 'Shopping',
    organizationId: 'org-bohubrihi-books',
  },
  {
    id: '5',
    title: 'VIP Panjabi Shopping',
    description: 'Members get a private fitting session and an exclusive 30% discount on Panjabis.',
    fullDescription: 'Elevate your style with a VIP experience at Aarong Style. As a valued member, you are invited for a complimentary private fitting session with one of our fashion experts. During your session, enjoy an exclusive 30% discount on your entire purchase of our exquisite Panjabi collection. Book your appointment today!',
    companyName: 'Aarong Style',
    latitude: 23.7772, // Dhanmondi, Dhaka
    longitude: 90.3855,
    isMemberOnly: true,
    distance: '1.8 mi',
    discount: '30% OFF',
    category: 'Shopping',
    organizationId: 'org-aarong-style',
  },
  {
    id: '6',
    title: 'Free Roshogolla',
    description: 'Get a free Roshogolla with any purchase over 200 Taka.',
    fullDescription: 'Cool down with a sweet treat from Sundarban Sweets. We make our sweets fresh every day with traditional recipes. When you spend 200 Taka or more, you get a free, delicious Roshogolla on us! Choose from our wide variety of authentic Bengali sweets.',
    companyName: 'Sundarban Sweets',
    latitude: 22.8183, // Khulna
    longitude: 89.5534,
    isMemberOnly: false,
    distance: '105 mi',
    discount: 'FREE',
    category: 'Food & Drink',
    organizationId: 'org-sundarban-sweets',
  },
];
