# 🔍 Elasticsearch 주니어 개발자 학습 커리큘럼

## 📋 목차
- [학습 목표](#-학습-목표)
- [사전 준비사항](#-사전-준비사항)
- [1단계: 환경 구축](#1단계-환경-구축)
- [2단계: Elasticsearch 기초 개념](#2단계-elasticsearch-기초-개념)
- [3단계: 기본 CRUD 연산](#3단계-기본-crud-연산)
- [4단계: 검색 기능 마스터하기](#4단계-검색-기능-마스터하기)
- [5단계: 데이터 분석과 집계](#5단계-데이터-분석과-집계)
- [6단계: 실제 애플리케이션 구축](#6단계-실제-애플리케이션-구축)
- [7단계: 성능 최적화와 모니터링](#7단계-성능-최적화와-모니터링)
- [프로젝트 아이디어](#-프로젝트-아이디어)
- [추가 학습 자료](#-추가-학습-자료)

## 🎯 학습 목표

이 커리큘럼을 완료하면 다음을 할 수 있습니다:
- Elasticsearch의 핵심 개념과 아키텍처 이해
- Docker를 사용한 Elasticsearch 환경 구축
- 효율적인 검색 쿼리 작성
- 데이터 분석과 시각화
- 실제 웹 애플리케이션에 검색 기능 통합
- 성능 최적화와 모니터링

## 🛠 사전 준비사항

### 필수 도구
- Docker Desktop 설치
- 터미널/명령줄 도구 사용 경험
- 기본적인 JSON 이해
- HTTP/REST API 개념

### 권장 지식
- 기본적인 데이터베이스 개념
- 웹 개발 경험 (선택사항)

---

## 1단계: 환경 구축

### 🐳 Docker로 Elasticsearch 시작하기

#### 1.1 기본 Elasticsearch 컨테이너 실행

```bash
# Elasticsearch 컨테이너 실행 (개발용)
docker run -p 9200:9200 -d --name elasticsearch \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "xpack.security.http.ssl.enabled=false" \
  -e "xpack.license.self_generated.type=trial" \
  docker.elastic.co/elasticsearch/elasticsearch:8.18.3
```

#### 1.2 Elasticsearch 상태 확인

```bash
# Elasticsearch가 실행 중인지 확인
curl http://localhost:9200

# 클러스터 상태 확인
curl http://localhost:9200/_cluster/health?pretty
```

#### 1.3 Kibana 추가 (선택사항)

```bash
# Kibana 컨테이너 실행
docker run -d --name kibana \
  -p 5601:5601 \
  -e "ELASTICSEARCH_HOSTS=http://host.docker.internal:9200" \
  docker.elastic.co/kibana/kibana:8.18.3
```

### 📝 실습 1-1: 환경 확인
- [ ] Elasticsearch가 정상적으로 실행되는지 확인
- [ ] 클러스터 정보 조회
- [ ] Kibana Dev Tools 접속 (선택사항)

---

## 2단계: Elasticsearch 기초 개념

### 🧭 핵심 개념 이해

#### 2.1 주요 용어
- **Index**: 관계형 DB의 데이터베이스와 유사
- **Document**: 관계형 DB의 행(row)과 유사한 JSON 객체
- **Field**: Document 내의 속성
- **Mapping**: Document의 구조를 정의하는 스키마
- **Shard**: Index를 여러 조각으로 나눈 것
- **Replica**: Shard의 복사본

#### 2.2 RESTful API 구조
```
POST /index_name/_doc          # 문서 생성
GET /index_name/_doc/doc_id    # 문서 조회
PUT /index_name/_doc/doc_id    # 문서 수정
DELETE /index_name/_doc/doc_id # 문서 삭제
```

### 📝 실습 2-1: 기본 개념 확인
```bash
# 모든 인덱스 목록 확인
curl "http://localhost:9200/_cat/indices?v"

# 클러스터 노드 정보
curl "http://localhost:9200/_cat/nodes?v"
```

---

## 3단계: 기본 CRUD 연산

### 📚 도서 관리 시스템 구축

#### 3.1 인덱스 생성과 매핑 설정

```bash
# 도서 인덱스 생성
curl -X PUT "http://localhost:9200/books" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard"
      },
      "author": {
        "type": "keyword"
      },
      "genre": {
        "type": "keyword"
      },
      "publication_date": {
        "type": "date"
      },
      "pages": {
        "type": "integer"
      },
      "price": {
        "type": "float"
      },
      "description": {
        "type": "text"
      },
      "rating": {
        "type": "float"
      }
    }
  }
}
'
```

#### 3.2 문서 생성 (Create)

```bash
# 첫 번째 도서 추가
curl -X POST "http://localhost:9200/books/_doc/1" -H 'Content-Type: application/json' -d'
{
  "title": "Elasticsearch 완벽 가이드",
  "author": "김엘라스틱",
  "genre": "기술서",
  "publication_date": "2024-01-15",
  "pages": 500,
  "price": 35000,
  "description": "Elasticsearch를 처음부터 끝까지 다루는 완벽한 가이드북",
  "rating": 4.8
}
'

# 두 번째 도서 추가
curl -X POST "http://localhost:9200/books/_doc/2" -H 'Content-Type: application/json' -d'
{
  "title": "모던 웹 개발",
  "author": "박웹개발",
  "genre": "기술서",
  "publication_date": "2023-06-20",
  "pages": 400,
  "price": 28000,
  "description": "최신 웹 개발 트렌드와 실무 노하우",
  "rating": 4.5
}
'
```

#### 3.3 문서 조회 (Read)

```bash
# 특정 문서 조회
curl "http://localhost:9200/books/_doc/1?pretty"

# 모든 문서 조회
curl "http://localhost:9200/books/_search?pretty"
```

#### 3.4 문서 수정 (Update)

```bash
# 부분 업데이트
curl -X POST "http://localhost:9200/books/_update/1" -H 'Content-Type: application/json' -d'
{
  "doc": {
    "price": 32000,
    "rating": 4.9
  }
}
'
```

#### 3.5 문서 삭제 (Delete)

```bash
# 문서 삭제
curl -X DELETE "http://localhost:9200/books/_doc/2"
```

### 📝 실습 3-1: CRUD 연습
- [ ] 자신만의 도서 데이터 5개 이상 추가
- [ ] 특정 도서 정보 수정
- [ ] 도서 검색 및 조회
- [ ] 불필요한 도서 삭제

---

## 4단계: 검색 기능 마스터하기

### 🔍 다양한 검색 쿼리 익히기

#### 4.1 기본 검색

```bash
# 전체 텍스트 검색
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "title": "Elasticsearch"
    }
  }
}
'
```

#### 4.2 정확한 매치 검색

```bash
# 정확한 키워드 매치
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "term": {
      "author.keyword": "김엘라스틱"
    }
  }
}
'
```

#### 4.3 범위 검색

```bash
# 가격 범위로 검색
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "range": {
      "price": {
        "gte": 20000,
        "lte": 40000
      }
    }
  }
}
'
```

#### 4.4 복합 검색 (Bool Query)

```bash
# 여러 조건을 조합한 검색
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "genre": "기술서"
          }
        }
      ],
      "filter": [
        {
          "range": {
            "rating": {
              "gte": 4.0
            }
          }
        }
      ],
      "should": [
        {
          "match": {
            "title": "웹"
          }
        }
      ]
    }
  }
}
'
```

#### 4.5 퍼지 검색 (오타 허용)

```bash
# 오타가 있어도 검색 가능
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "fuzzy": {
      "title": {
        "value": "엘라스틱서치",
        "fuzziness": "AUTO"
      }
    }
  }
}
'
```

#### 4.6 하이라이트 기능

```bash
# 검색 결과에서 매치된 부분 하이라이트
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "description": "가이드"
    }
  },
  "highlight": {
    "fields": {
      "description": {}
    }
  }
}
'
```

### 📝 실습 4-1: 검색 마스터하기
- [ ] 제목으로 도서 검색
- [ ] 가격 범위로 필터링
- [ ] 복합 조건 검색 (장르 + 평점)
- [ ] 오타가 있는 검색어로 퍼지 검색
- [ ] 검색 결과 하이라이트 확인

---

## 5단계: 데이터 분석과 집계

### 📊 집계(Aggregation)로 데이터 분석하기

#### 5.1 샘플 데이터 추가

```bash
# 추가 도서 데이터들을 bulk로 입력
curl -X POST "http://localhost:9200/books/_bulk" -H 'Content-Type: application/json' -d'
{"index":{"_id":"3"}}
{"title":"Python 마스터하기","author":"이파이썬","genre":"프로그래밍","publication_date":"2023-03-15","pages":600,"price":42000,"description":"Python 고급 프로그래밍 기법","rating":4.7}
{"index":{"_id":"4"}}
{"title":"JavaScript 완전정복","author":"최자바스크립트","genre":"프로그래밍","publication_date":"2023-08-10","pages":550,"price":38000,"description":"모던 JavaScript 개발","rating":4.6}
{"index":{"_id":"5"}}
{"title":"데이터 사이언스 입문","author":"박데이터","genre":"데이터사이언스","publication_date":"2024-02-20","pages":450,"price":35000,"description":"데이터 분석의 모든 것","rating":4.4}
{"index":{"_id":"6"}}
{"title":"머신러닝 실전","author":"김머신","genre":"데이터사이언스","publication_date":"2023-11-05","pages":520,"price":45000,"description":"실무에서 바로 써먹는 머신러닝","rating":4.8}
'
```

#### 5.2 기본 통계 집계

```bash
# 가격 통계 (평균, 최대, 최소)
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "price_stats": {
      "stats": {
        "field": "price"
      }
    }
  }
}
'
```

#### 5.3 그룹별 집계

```bash
# 장르별 도서 수
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "genres": {
      "terms": {
        "field": "genre.keyword"
      }
    }
  }
}
'
```

#### 5.4 중첩 집계

```bash
# 장르별 평균 가격과 평점
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "by_genre": {
      "terms": {
        "field": "genre.keyword"
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        },
        "avg_rating": {
          "avg": {
            "field": "rating"
          }
        }
      }
    }
  }
}
'
```

#### 5.5 히스토그램 집계

```bash
# 가격대별 분포
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "price_histogram": {
      "histogram": {
        "field": "price",
        "interval": 10000
      }
    }
  }
}
'
```

### 📝 실습 5-1: 데이터 분석하기
- [ ] 전체 도서의 평균 가격 계산
- [ ] 장르별 도서 수 확인
- [ ] 평점이 높은 상위 3개 장르 찾기
- [ ] 페이지 수별 히스토그램 생성

---

## 6단계: 실제 애플리케이션 구축

### 🚀 간단한 도서 검색 API 만들기

#### 6.1 고급 검색 API 설계

```bash
# 복합 검색 API (제목, 저자, 설명에서 검색)
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "multi_match": {
      "query": "웹 개발",
      "fields": ["title^2", "author", "description"],
      "type": "best_fields"
    }
  },
  "sort": [
    {"rating": {"order": "desc"}},
    {"_score": {"order": "desc"}}
  ],
  "from": 0,
  "size": 10
}
'
```

#### 6.2 자동완성 기능

```bash
# 자동완성을 위한 suggest 설정
curl -X PUT "http://localhost:9200/books_suggest" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fields": {
          "suggest": {
            "type": "completion"
          }
        }
      },
      "author": {
        "type": "keyword"
      }
    }
  }
}
'

# 자동완성 쿼리
curl -X POST "http://localhost:9200/books_suggest/_search" -H 'Content-Type: application/json' -d'
{
  "suggest": {
    "title_suggest": {
      "prefix": "Ela",
      "completion": {
        "field": "title.suggest"
      }
    }
  }
}
'
```

#### 6.3 패싯 검색 (필터링)

```bash
# 패싯과 함께 검색
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  },
  "aggs": {
    "genres": {
      "terms": {
        "field": "genre.keyword"
      }
    },
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          {"to": 30000, "key": "저가"},
          {"from": 30000, "to": 40000, "key": "중가"},
          {"from": 40000, "key": "고가"}
        ]
      }
    }
  }
}
'
```

### 📝 실습 6-1: 검색 애플리케이션 구현
- [ ] 복합 검색 기능 구현
- [ ] 정렬 옵션 추가 (가격, 평점, 최신순)
- [ ] 페이지네이션 구현
- [ ] 필터링 기능 추가

---

## 7단계: 성능 최적화와 모니터링

### ⚡ 성능 최적화 기법

#### 7.1 인덱스 최적화

```bash
# 인덱스 설정 최적화
curl -X PUT "http://localhost:9200/books_optimized" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "refresh_interval": "30s"
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard",
        "store": true
      },
      "genre": {
        "type": "keyword",
        "doc_values": true
      }
    }
  }
}
'
```

#### 7.2 성능 모니터링

```bash
# 인덱스 상태 확인
curl "http://localhost:9200/_cat/indices/books*?v&s=store.size:desc"

# 쿼리 성능 분석
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "profile": true,
  "query": {
    "match": {
      "title": "Elasticsearch"
    }
  }
}
'
```

#### 7.3 캐싱 활용

```bash
# 쿼리 캐시 상태 확인
curl "http://localhost:9200/_stats/query_cache?pretty"

# 필터 컨텍스트로 캐시 활용
curl -X GET "http://localhost:9200/books/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "genre.keyword": "기술서"
          }
        }
      ]
    }
  }
}
'
```

### 📝 실습 7-1: 성능 최적화
- [ ] 인덱스 설정 최적화
- [ ] 쿼리 프로파일링으로 병목 지점 찾기
- [ ] 캐시 효율성 확인

---

## 🎨 프로젝트 아이디어

### 초급 프로젝트
1. **개인 도서관 관리 시스템**
   - 책 등록, 검색, 분류
   - 읽은 책 평점 관리

2. **블로그 검색 엔진**
   - 블로그 포스트 색인
   - 태그별 검색

### 중급 프로젝트
3. **이커머스 상품 검색**
   - 상품 검색 및 필터링
   - 추천 시스템

4. **로그 분석 시스템**
   - 웹 서버 로그 분석
   - 실시간 모니터링 대시보드

### 고급 프로젝트
5. **검색 기반 추천 시스템**
   - 사용자 검색 패턴 분석
   - 개인화된 추천

6. **다국어 검색 엔진**
   - 여러 언어 지원
   - 형태소 분석기 활용

---

## 📚 추가 학습 자료

### 공식 문서
- [Elasticsearch 공식 문서](https://www.elastic.co/guide/en/elasticsearch/reference/current/)
- [Kibana 사용 가이드](https://www.elastic.co/guide/en/kibana/current/)

### 심화 학습 주제
- **ELK Stack**: Elasticsearch + Logstash + Kibana
- **Beats**: 데이터 수집 도구들
- **Machine Learning**: Elasticsearch의 ML 기능
- **Security**: X-Pack 보안 기능
- **클러스터 관리**: 운영 환경 구축

### 실무 활용 사례
- 검색 엔진 구축
- 로그 분석 및 모니터링
- 비즈니스 인텔리전스
- 실시간 데이터 분석
- APM(Application Performance Monitoring)

---

## 🏆 학습 완료 체크리스트

### 기초 (1-3단계)
- [ ] Docker로 Elasticsearch 환경 구축
- [ ] 기본 CRUD 연산 수행
- [ ] 인덱스와 매핑 이해

### 중급 (4-5단계)
- [ ] 다양한 검색 쿼리 작성
- [ ] 집계 기능으로 데이터 분석
- [ ] Bool 쿼리 활용

### 고급 (6-7단계)
- [ ] 검색 애플리케이션 구축
- [ ] 성능 최적화 적용
- [ ] 모니터링과 문제 해결

---

## 💡 팁과 주의사항

### 개발 팁
- **작은 데이터셋부터 시작**: 복잡한 쿼리를 작은 데이터로 먼저 테스트
- **Dev Tools 활용**: Kibana의 Dev Tools를 사용하면 더 편리함
- **버전 호환성 확인**: Elasticsearch 버전별 기능 차이 주의

### 운영 시 주의사항
- **메모리 관리**: JVM 힙 메모리 설정 중요
- **디스크 공간**: 로그와 데이터 증가량 모니터링
- **보안 설정**: 운영 환경에서는 반드시 보안 기능 활성화

---

## 🤝 커뮤니티와 도움받기

- **Elastic 공식 포럼**: https://discuss.elastic.co/
- **한국 Elasticsearch 사용자 그룹**: 국내 커뮤니티 참여
- **Stack Overflow**: elasticsearch 태그로 질문
- **GitHub**: Elasticsearch 저장소에서 이슈 확인

---

**축하합니다! 🎉**
이 커리큘럼을 완료하시면 Elasticsearch의 핵심 기능을 모두 익히게 됩니다. 
실무에서 바로 활용할 수 있는 검색 시스템을 구축할 수 있을 것입니다!

*"검색은 단순히 데이터를 찾는 것이 아니라, 정보를 발견하는 것입니다." - Elasticsearch 철학*