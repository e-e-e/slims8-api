import { TopicData, TopicType } from "../../src/models/topic";

export const simpleTopic: TopicData = { name: 'anarchism' };

export const topicWithType: TopicData = { name: 'australia', type: TopicType.GEOGRAPHIC };

export const topicWithClassification: TopicData = { name: 'classified', classification: 'a-loc-id' };

export const topicWithAuthList: TopicData = { name: 'bibliography', authorityList: 'loc' };