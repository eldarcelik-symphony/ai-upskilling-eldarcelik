import { convertApiResponse } from './convertApiResponse';

describe('convertApiResponse', () => {
  describe('snake_case to camelCase conversion', () => {
    it('should convert simple object keys from snake_case to camelCase', () => {
      const input = {
        poster_path: '/path/to/image.jpg',
        vote_average: 8.5,
        first_air_date: '2023-01-01',
        release_date: '2023-12-31',
      };

      const expected = {
        posterPath: '/path/to/image.jpg',
        voteAverage: 8.5,
        firstAirDate: '2023-01-01',
        releaseDate: '2023-12-31',
      };

      expect(convertApiResponse(input)).toEqual(expected);
    });

    it('should handle strings without underscores', () => {
      const input = {
        title: 'Movie Title',
        name: 'Show Name',
        id: 123,
        overview: 'Description',
      };

      const result = convertApiResponse(input);
      expect(result).toEqual(input); // Should remain unchanged
    });

    it('should handle multiple underscores in keys', () => {
      const input = {
        very_long_snake_case_string: 'value',
        multiple_underscores_in_key: 'test',
        deep_nested_property_name: 'nested',
      };

      const expected = {
        veryLongSnakeCaseString: 'value',
        multipleUnderscoresInKey: 'test',
        deepNestedPropertyName: 'nested',
      };

      expect(convertApiResponse(input)).toEqual(expected);
    });
  });

  describe('nested objects and arrays', () => {
    it('should convert nested object keys', () => {
      const input = {
        level_1: {
          level_2: {
            level_3: {
              deep_property: 'value',
              another_property: 123,
            },
          },
        },
      };

      const expected = {
        level1: {
          level2: {
            level3: {
              deepProperty: 'value',
              anotherProperty: 123,
            },
          },
        },
      };

      expect(convertApiResponse(input)).toEqual(expected);
    });

    it('should convert array elements', () => {
      const input = {
        results: [
          {
            poster_path: '/path1.jpg',
            vote_average: 7.5,
          },
          {
            poster_path: '/path2.jpg',
            vote_average: 8.0,
          },
        ],
      };

      const expected = {
        results: [
          {
            posterPath: '/path1.jpg',
            voteAverage: 7.5,
          },
          {
            posterPath: '/path2.jpg',
            voteAverage: 8.0,
          },
        ],
      };

      expect(convertApiResponse(input)).toEqual(expected);
    });

    it('should handle deeply nested arrays', () => {
      const input = {
        data: [
          [
            {
              item_key: 'item_value',
              nested_array: [{ deep_key: 'deep_value' }],
            },
          ],
        ],
      };

      const expected = {
        data: [
          [
            {
              itemKey: 'item_value',
              nestedArray: [{ deepKey: 'deep_value' }],
            },
          ],
        ],
      };

      expect(convertApiResponse(input)).toEqual(expected);
    });
  });

  describe('special object types', () => {
    it('should preserve Date objects', () => {
      const date = new Date('2023-01-01');
      const input = {
        created_at: date,
        updated_at: new Date('2023-12-31'),
      };

      const result = convertApiResponse(input) as any;
      expect(result.createdAt).toBe(date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve RegExp objects', () => {
      const regex = /test/;
      const input = {
        pattern: regex,
        validation_regex: /^[a-z]+$/,
      };

      const result = convertApiResponse(input) as any;
      expect(result.pattern).toBe(regex);
      expect(result.validationRegex).toBeInstanceOf(RegExp);
    });

    it('should convert Map object keys', () => {
      const input = new Map<string, any>([
        ['poster_path', '/path.jpg'],
        ['vote_average', 8.5],
        ['release_date', '2023-01-01'],
      ]);

      const result = convertApiResponse(input) as Map<any, any>;
      expect(result).toBeInstanceOf(Map);
      expect(result.get('posterPath')).toBe('/path.jpg');
      expect(result.get('voteAverage')).toBe(8.5);
      expect(result.get('releaseDate')).toBe('2023-01-01');
    });

    it('should convert Set object values', () => {
      const input = new Set([{ item_key: 'value1' }, { item_key: 'value2' }]);

      const result = convertApiResponse(input) as Set<any>;
      expect(result).toBeInstanceOf(Set);

      const values = Array.from(result.values());
      expect(values[0].itemKey).toBe('value1');
      expect(values[1].itemKey).toBe('value2');
    });
  });

  describe('edge cases and special values', () => {
    it('should handle null and undefined values', () => {
      expect(convertApiResponse(null)).toBeNull();
      expect(convertApiResponse(undefined)).toBeUndefined();
    });

    it('should handle primitive values', () => {
      expect(convertApiResponse('string')).toBe('string');
      expect(convertApiResponse(123)).toBe(123);
      expect(convertApiResponse(true)).toBe(true);
      expect(convertApiResponse(false)).toBe(false);
    });

    it('should handle empty objects and arrays', () => {
      expect(convertApiResponse({})).toEqual({});
      expect(convertApiResponse([])).toEqual([]);
    });

    it('should handle objects with constructor', () => {
      class TestClass {
        constructor(public test_property: string) {}
      }

      const input = new TestClass('value');
      const result = convertApiResponse(input);

      expect(result).toBeInstanceOf(TestClass);
      expect((result as any).testProperty).toBe('value');
    });

    it('should handle mixed data types', () => {
      const input = {
        simple_property: 'value',
        nested_object: {
          array_property: [{ item_key: 'item_value' }, { another_key: 'another_value' }],
          map_property: new Map([['map_key', 'map_value']]),
          set_property: new Set(['set_item']),
        },
        date_property: new Date('2023-01-01'),
        regex_property: /test/,
        primitive_property: 42,
        boolean_property: true,
      };

      const result = convertApiResponse(input) as any;

      expect(result.simpleProperty).toBe('value');
      expect(result.nestedObject.arrayProperty[0].itemKey).toBe('item_value');
      expect(result.nestedObject.mapProperty.get('mapKey')).toBe('map_value');
      expect(result.nestedObject.setProperty.has('set_item')).toBe(true);
      expect(result.dateProperty).toBeInstanceOf(Date);
      expect(result.regexProperty).toBeInstanceOf(RegExp);
      expect(result.primitiveProperty).toBe(42);
      expect(result.booleanProperty).toBe(true);
    });
  });

  describe('API response scenarios', () => {
    it('should handle typical TMDB movie response', () => {
      const input = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Movie Title',
            poster_path: '/poster.jpg',
            vote_average: 8.5,
            release_date: '2023-01-01',
            overview: 'Movie description',
            genre_ids: [28, 12],
            adult: false,
            backdrop_path: '/backdrop.jpg',
            original_language: 'en',
            original_title: 'Original Title',
            popularity: 100.0,
            video: false,
            vote_count: 1000,
          },
        ],
        total_pages: 10,
        total_results: 100,
      };

      const result = convertApiResponse(input) as any;

      expect(result.page).toBe(1);
      expect(result.results[0].posterPath).toBe('/poster.jpg');
      expect(result.results[0].voteAverage).toBe(8.5);
      expect(result.results[0].releaseDate).toBe('2023-01-01');
      expect(result.results[0].genreIds).toEqual([28, 12]);
      expect(result.results[0].backdropPath).toBe('/backdrop.jpg');
      expect(result.results[0].originalLanguage).toBe('en');
      expect(result.results[0].originalTitle).toBe('Original Title');
      expect(result.results[0].voteCount).toBe(1000);
      expect(result.totalPages).toBe(10);
      expect(result.totalResults).toBe(100);
    });

    it('should handle TV show response with videos', () => {
      const input = {
        id: 123,
        name: 'TV Show',
        overview: 'Show description',
        poster_path: '/show-poster.jpg',
        vote_average: 7.8,
        first_air_date: '2023-01-01',
        last_air_date: '2023-12-31',
        videos: {
          results: [
            { key: 'video_key_1', type: 'Trailer' },
            { key: 'video_key_2', type: 'Teaser' },
          ],
        },
      };

      const result = convertApiResponse(input) as any;

      expect(result.name).toBe('TV Show');
      expect(result.posterPath).toBe('/show-poster.jpg');
      expect(result.voteAverage).toBe(7.8);
      expect(result.firstAirDate).toBe('2023-01-01');
      expect(result.lastAirDate).toBe('2023-12-31');
      expect(result.videos.results[0].key).toBe('video_key_1');
      expect(result.videos.results[1].key).toBe('video_key_2');
    });
  });

  describe('performance and large data', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        item_key: `item_${i}`,
        nested_property: {
          deep_key: `deep_${i}`,
          array_property: Array.from({ length: 10 }, (_, j) => ({
            sub_key: `sub_${i}_${j}`,
          })),
        },
      }));

      const start = performance.now();
      const result = convertApiResponse(largeArray) as any;
      const end = performance.now();

      expect(result).toHaveLength(1000);
      expect(result[0].itemKey).toBe('item_0');
      expect(result[999].itemKey).toBe('item_999');
      expect(result[0].nestedProperty.deepKey).toBe('deep_0');
      expect(result[0].nestedProperty.arrayProperty[0].subKey).toBe('sub_0_0');

      // Should complete in reasonable time (less than 100ms)
      expect(end - start).toBeLessThan(100);
    });
  });
});
