from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import OrderedDict

import pandas as pd
from pandas import json_normalize
import json
from sklearn.metrics.pairwise import cosine_similarity   #importing modules

app=Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4000"}})

def extract_skill_names(skills):
  if skills is None or isinstance(skills, float):
    return [' ']

  return [skill['Name'] for skill in skills]
def get_recommendations(user, alldata):       #algorithm function begins, takes username as argument

  df=json_normalize(alldata)   # making a datafram from json data

  Skills_df=df[['User.Personal_info.Username','User.Skills.learning_skills','User.Skills.teaching_skills']].copy()
  Skills_df.loc[:, 'Learning_skill_names'] = Skills_df['User.Skills.learning_skills'].apply(extract_skill_names)
  Skills_df.loc[:, 'Teaching_skill_names'] = Skills_df['User.Skills.teaching_skills'].apply(extract_skill_names)

  #one hot encoding skills to have 0s and 1s (works for multiple skills)
  learning_skills_one_hot = pd.get_dummies(Skills_df['Learning_skill_names'].apply(pd.Series).stack(),prefix='Learning_skill_names').groupby(level=0).sum()
  teaching_skills_one_hot = pd.get_dummies(Skills_df['Teaching_skill_names'].apply(pd.Series).stack(),prefix='Teaching_skill_names').groupby(level=0).sum()

  # joining teaching and learning skills back into skills df
  Skills_df = pd.concat([Skills_df[['User.Personal_info.Username']], learning_skills_one_hot, teaching_skills_one_hot], axis=1)

  # taking learning and teaching skills separately for similarity
  learning_skill_columns = Skills_df.columns[Skills_df.columns.str.startswith('Learning_skill_names')]
  learning_skill = Skills_df.loc[:, learning_skill_columns].fillna(0)  # Note: fillna now returns a new DataFrame

  teaching_skill_columns = Skills_df.columns[Skills_df.columns.str.startswith('Teaching_skill_names')]
  teaching_skill = Skills_df.loc[:, teaching_skill_columns].fillna(0)  # Same as above


  Skills_df.set_index('User.Personal_info.Username',inplace=True)

  #initialiazing a matrix (fancy term for df) for teaching and learning skill similarity
  teaching_learning_similarity_matrix=pd.DataFrame(0,index=Skills_df.index, columns=Skills_df.index)

  for user_a in Skills_df.index:
    learning_a = [skill.replace('Learning_skill_names_', '') 
    for skill in learning_skill.columns
      if skill in Skills_df.index and Skills_df.loc[user_a, skill] == 1]
    
    if learning_a is None or not learning_a:
        learning_a = []  # Ensure learning_a is always a list

    for user_b in Skills_df.index:
      if user_a!=user_b:
        teaching_b=[skill.replace('Teaching_skill_names_','') for skill in teaching_skill if skill in Skills_df.index and Skills_df.loc[user_b, skill]==1]
        learning_b=[skill.replace('Learning_skill_names_','') for skill in learning_skill if skill in Skills_df.index and Skills_df.loc[user_b, skill]==1]
        teaching_a=[skill.replace('Teaching_skill_names_','') for skill in teaching_skill if skill in Skills_df.index and Skills_df.loc[user_a, skill]==1]

        matches_a_to_b=len(set(learning_a) & set(teaching_b))   # using set between learning skills of one user and teaching of another and vice-versa
        matches_b_to_a=len(set(teaching_a) & set(learning_b))    # 1s if they match, 0s if they don't

        teaching_learning_similarity_matrix.loc[user_a,user_b]=matches_a_to_b + matches_b_to_a   #adding similarities to each row, column

  # making a learning skill similarity matrix
  learning_skill_similarity_matrix=cosine_similarity(learning_skill.iloc[:,:])
  learning_skill_similarity_matrix=pd.DataFrame(learning_skill_similarity_matrix, index=Skills_df.index, columns=Skills_df.index)

  #making a teaching skill similarity matrix
  teaching_skill_similarity_matrix=cosine_similarity(teaching_skill)
  teaching_skill_similarity_matrix=pd.DataFrame(teaching_skill_similarity_matrix, index=Skills_df.index, columns=Skills_df.index)

  #making a year similarity matrix
  year_df=df[['User.Personal_info.year']]
  year_df=year_df.join(pd.get_dummies(year_df[['User.Personal_info.year']])).drop(['User.Personal_info.year'],axis=1)
  year_similarity_matrix=cosine_similarity(year_df)
  year_similarity_matrix=pd.DataFrame(year_similarity_matrix, index=Skills_df.index, columns= Skills_df.index)

  #making a final similairty matrix with weightage for each martrix (can change later)
  final_similarity_matrix=teaching_learning_similarity_matrix*0.5 + learning_skill_similarity_matrix*0.25 + teaching_skill_similarity_matrix*0.2 + year_similarity_matrix*0.1

  recommendations=final_similarity_matrix[user].drop([user]) # removing current user from recommendations
  recommendations=recommendations.sort_values(ascending=False).head(12)       # taking the top 10 values from highest similarity score
  recommendations_dict = recommendations.to_dict()  
  recommendation_list=[(key, value) for key, value in recommendations_dict.items()]  #converting to list because json acts funny with dict
  #print(recommendations_dict)
  #for key, value in recommendations_dict.items():
    #print(f"Key: {key} (type: {type(key)}), Value: {value} (type: {type(value)})")


  return recommendation_list   #returning list of tuples of usernames wirth scores
  

@app.route('/api/getrecommendations',methods=['POST'])   #post request from express
def recommendations():
  data=request.get_json()
  user=data['username']
  users_data=data['usersdata']    #receive username and usersdata as paramters
  final_recommendations=get_recommendations(user,users_data)
  return final_recommendations    #returning json data of usernames to express

if __name__=='__main__':
  app.run(port=8000)