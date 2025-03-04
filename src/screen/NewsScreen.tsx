import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../component/Header';

const API_KEY = '36456e3684d64096a0cca86796f80154';
const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

interface Article {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
}

const NewsScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchNews = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}&page=${pageNumber}`);
      if (pageNumber === 1) {
        await AsyncStorage.setItem('news', JSON.stringify(response.data.articles));
      }
      setArticles(prev => (pageNumber === 1 ? response.data.articles : [...prev, ...response.data.articles]));
      setPage(pageNumber);
    } catch (error) {
      const cachedNews = await AsyncStorage.getItem('news');
      if (cachedNews) {
        setArticles(JSON.parse(cachedNews));
      } else {
        alert('Failed to load news and no cached data available.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const loadMoreNews = () => {
    if (!loading) {
      fetchNews(page + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(1);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Article }) => (
    <View style={styles.articleContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
     <Header />
      <TextInput
        style={styles.searchBar}
        placeholder="Search news..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredArticles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={loadMoreNews}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator style={{ marginTop:"100%"}} size="large" color="#5252f7" /> : null}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  articleContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#5252f7'
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  readMore: {
    color: 'blue',
    marginTop: 5,
  },
});

export default NewsScreen;

function alert(arg0: string) {
    throw new Error('Function not implemented.');
}

