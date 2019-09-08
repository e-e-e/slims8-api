import { Topic, TopicData, TopicType } from '../src/models/topic';
import { createCrudTests } from './crud_helpers';

describe('Topic', () => {
  const simple: TopicData = { name: 'anarchism' };
  const withType: TopicData = { name: 'australia', type: TopicType.GEOGRAPHIC };
  const withClassification: TopicData = { name: 'classified', classification: 'a-loc-id' };
  const withAuthList: TopicData = { name: 'bibliography', authorityList: 'loc' };

  const topics = [
    simple,
    withType,
    withClassification,
    withAuthList,
  ];

  const seeds = [{
    name: 'Posthumanism',
  }]

  describe('abstract crud interface', createCrudTests<TopicData>({
    createModel: db => new Topic(db),
    clean: async (knex) => knex(`mst_topic`).delete().where('topic_id', '>=', 0),
    seeds,
    create: topics,
    duplicates: topics,
  }))
});
