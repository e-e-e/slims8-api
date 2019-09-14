import { Topic, TopicData } from '../src/models/topic';
import { createCrudTests } from './crud_helpers';
import { topicWithAuthList, topicWithClassification, topicWithType, simpleTopic } from './fakes/topics';

describe('Topic', () => {

  const topics = [
    simpleTopic,
    topicWithAuthList,
    topicWithClassification,
    topicWithType,
  ];

  const seeds = [{
    name: 'Posthumanism',
  }];

  /* eslint-disable-next-line jest/valid-describe */
  describe('abstract crud interface', createCrudTests<TopicData>({
    createModel: db => new Topic(db),
    clean: async (knex) => knex('mst_topic').delete().where('topic_id', '>=', 0),
    seeds,
    create: topics,
    duplicates: topics,
  }));
});
