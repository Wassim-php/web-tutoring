import { DataSource } from 'typeorm';
import { Topic } from '../../topics/entities/topic.entity';

export const seedTopics = async (dataSource: DataSource) => {
    const topicRepository = dataSource.getRepository(Topic);

    const topics: Partial<Topic>[] = [
        {
            name: 'Math',
            description: 'Experienced math tutor with a passion for helping students excel in algebra, geometry, and calculus.',
            category: 'Mathematics',
            is_active: true
        },
        {
            name: 'Science',
            description: 'Science tutor specializing in biology, chemistry, and physics, with a focus on hands-on learning and real-world applications.',
            category: 'Science',
            is_active: true
        },
        {
            name: 'Coding',
            description: 'Coding tutor with expertise in Python, JavaScript, and web development, dedicated to teaching students the fundamentals of programming.',
            category: 'Computer Science',
            is_active: true
        },
        {
            name: 'Language Arts',
            description: 'Language arts tutor with a background in literature and writing, helping students improve their reading comprehension and essay writing skills.',
            category: 'English',
            is_active: true
        },
        {
            name: 'Chemistry',
            description: 'Chemistry tutor with a deep understanding of chemical principles and laboratory techniques, helping students succeed in their chemistry courses.',
            category: 'Science',
            is_active: true
        }
    ];

    try {
        for (const topicData of topics) {
            const existingTopic = await topicRepository.findOne({ 
                where: { name: topicData.name } 
            });
            
            if (!existingTopic) {
                const topic = topicRepository.create(topicData);
                await topicRepository.save(topic);
                console.log(`Seeded topic: ${topic.name}`);
            }
        }
        console.log('Topics seeding completed');
    } catch (error) {
        console.error('Error seeding topics:', error);
    }
};