   M S B A M L   `   `   `  ����]  YC1.WPF.BarCode.4, Version=4.0.20153.495, Culture=neutral, PublicKeyToken=2aa4ec5576d6c3ceA2clr-namespace:C1.BarCode;assembly=C1.WPF.BarCode.4
C1.BarCode  5   	    BarCodeApp_VB,   &BarCodeApp_VB.BarCodeApp_VB.MainWindow   5      R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5      R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	   U QC1.WPF.4, Version=4.0.20153.495, Culture=neutral, PublicKeyToken=2aa4ec5576d6c3ce:c1/http://schemas.componentone.com/winfx/2006/xaml    5   	   BBarCode2clr-namespace:C1.BarCode;assembly=C1.WPF.BarCode.4    5   	   ;c11/http://schemas.componentone.com/winfx/2006/xaml    5        � Title$  BarCode Sample��5      $��590.465��6   $��832.49��6-   .��5	      �  � 	Resources 5
   
    �� 
TargetType �� Property �� Value��%�   '��       '�� H     '�� �     �� 5      " ��6   .�5      ��  � ��$ 18(�6-   5      �� 5      " ��6   .�5      ��  � ��$ 18(�6-   5      �� 5      " ��6   .�5      ��  � ��$ 18(�6-   5      5      .+�5   
   �� $��Center=�6   ._�5      �  � RowDefinitions 5      �� 5      $	��20* �6$   �� 5      $	��20* �6$   �� 5      $	��60* �6$    � ColumnDefinitions 5      �� 5      $	��40* �6'   �� 5      $	��60* �6'   .+�5"      �� $��	CodeType:��6   $��Center=�6-   �� 5#      -   5         ��Name$ 
cbCodeType��5#      $
��Left=�60   $��1��6K   $	��414��5$      $��50��6   5%      �� 5&      $��Text:��6   $��1��6)   $��Center=�66   �� 5'      -   5         ��Name$
 text��5'      $
��Left=�5(      $��1��6!   $��1��61   $��50��6>   $	��414��6J   ��5'   (   �� *Text+	 �� ElementName$	 barcode��
 �� FallbackValue$
  �� �� Mode$ TwoWay=� �� UpdateSourceTrigger$ PropertyChanged=�5(   V   �� 5)      $��BarCode:��6   $��2��6,   $��Center=�69   � 5*      $��1��6   $��1��6$   
�������$
��Left=�6G   $	��414��6b   $��10,102,-10,10q�6n   $��2��6�   5+      5,         C1.WPF.BarCode.C1BarCode  5-   
   -   5          Name$ barcode��5-         AutoSize .     	BarHeight$ 0Q�6:      CodeType$ QRCode=�6H      CaptionPosition$ Below=�6Z      Text$! http://www.componentone.com��5.      $	��200��6;   $	��230��6H   $
��Left=�6T   $��366,282,0,77q�6o      QRCodeOptions 5/         C1.BarCode.QRCodeOptions  50         
ErrorLevel$
 High=�6(   52      �� 53   
   -   5         ��Name$ image��54      $��Resources/c1logo.png��53      $��70��54   #   $��70��6.   $��428,352,326,137q�6:   56      57      